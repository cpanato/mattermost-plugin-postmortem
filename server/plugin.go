package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const iconURL = "https://www.clipartmax.com/png/middle/192-1921764_download-png-image-report-white-notepad-icon-png.png"

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin
}

// OnActivate runs when the plugin is activated
func (p *Plugin) OnActivate() error {
	if err := p.registerCommands(); err != nil {
		return errors.Wrap(err, "failed to register commands")
	}

	return nil
}

// OnDeactivate runs when the plugin is deactivated
func (p *Plugin) OnDeactivate() error {
	if err := p.deRegisterCommands(); err != nil {
		return errors.Wrap(err, "failed to register commands")
	}

	return nil
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/create":
		p.handleCreate(w, r)
	default:
		http.NotFound(w, r)
	}
}

// CreateAPIRequest struct to decode the data coming from the webapp
type CreateAPIRequest struct {
	Args struct {
		ChannelID string `json:"channel_id"`
		TeamID    string `json:"team_id"`
		RootID    string `json:"root_id"`
		ParentID  string `json:"parent_id"`
	} `json:"args"`
	Overview     string `json:"overview"`
	WhatHappened string `json:"whatHappened"`
	RootCause    string `json:"rootCause"`
	Impact       string `json:"impact"`
	Responders   string `json:"responders"`
	ActionItems  string `json:"actionItems"`
}

func (p *Plugin) handleCreate(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-ID")
	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}

	var createRequest *CreateAPIRequest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&createRequest)
	if err != nil {
		p.API.LogError("Unable to decode JSON err=" + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user, appErr := p.API.GetUser(userID)
	if appErr != nil {
		p.API.LogError("Unable to get user err=" + appErr.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	responders := createRequest.Responders
	if createRequest.Responders == "" {
		responders = "N/A"
	}

	actionItems := createRequest.ActionItems
	if createRequest.ActionItems == "" {
		actionItems = "N/A"
	}

	postMsg := fmt.Sprintf(`
# Post Mortem - %s

## Overview

%s

## What Happened

%s

## Root Cause

%s

## Impact

%s

## Responders

%s

## Action Items

%s


_made using Post Mortem plugin_
`,
		time.Now().Format(time.Stamp),
		createRequest.Overview,
		createRequest.WhatHappened,
		createRequest.RootCause,
		createRequest.Impact,
		responders,
		actionItems,
	)

	post := &model.Post{
		UserId:    user.Id,
		ChannelId: createRequest.Args.ChannelID,
		Message:   postMsg,
	}

	post.AddProp("from_webhook", "true")
	post.AddProp("override_username", "Post Mortem")
	post.AddProp("override_icon_url", iconURL)

	if createRequest.Args.RootID != "" {
		post.RootId = createRequest.Args.RootID
	}

	_, appErr = p.API.CreatePost(post)
	if appErr != nil {
		p.API.LogError("Unable to create post err=" + appErr.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
