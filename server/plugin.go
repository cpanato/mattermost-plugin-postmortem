package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"

	"github.com/pkg/errors"

	"github.com/mandolyte/mdtopdf"
	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const iconURL = "https://cdn0.iconfinder.com/data/icons/online-education-butterscotch-vol-2/512/Student_Notes-512.png"

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
	Overview    string `json:"overview"`
	Timeline    string `json:"timeline"`
	RootCause   string `json:"rootCause"`
	Impact      string `json:"impact"`
	Recovery    string `json:"recovery"`
	Lessons     string `json:"lessons"`
	ActionItems string `json:"actionItems"`
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

	actionItems := createRequest.ActionItems
	if createRequest.ActionItems == "" {
		actionItems = "N/A"
	}

	postMsg := fmt.Sprintf(`
# Post Mortem

## Incident Summary

%s

## Impact

%s

## Timeline

%s

## Root Cause

%s

## Recovery

%s

## Lessons learned

%s

## Actions

%s

_made using Post Mortem plugin_
`,
		createRequest.Overview,
		createRequest.Impact,
		createRequest.Timeline,
		createRequest.RootCause,
		createRequest.Recovery,
		createRequest.Lessons,
		actionItems,
	)

	fileName := tempFileName("postmortem")
	defer os.Remove(fileName)

	pf := mdtopdf.NewPdfRenderer("", "", fileName, "")
	pf.THeader = mdtopdf.Styler{Font: "Times", Style: "IUB", Size: 20, Spacing: 2,
		TextColor: mdtopdf.Color{Red: 0, Green: 0, Blue: 0},
		FillColor: mdtopdf.Color{Red: 179, Green: 179, Blue: 255}}
	pf.TBody = mdtopdf.Styler{Font: "Arial", Style: "", Size: 12, Spacing: 2,
		TextColor: mdtopdf.Color{Red: 0, Green: 0, Blue: 0},
		FillColor: mdtopdf.Color{Red: 255, Green: 102, Blue: 129}}

	err = pf.Process([]byte(postMsg))
	if err != nil {
		p.API.LogError("pdf.OutputFileAndClose()  err=" + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		p.API.LogError("Unable to read the pdf file err=" + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fileToPost, errUploadFile := p.API.UploadFile(data, createRequest.Args.ChannelID, "post-mortem.pdf")
	if errUploadFile != nil {
		p.API.LogError("Error uploading the log file", "Err", errUploadFile.Error())
	}

	post := &model.Post{
		UserId:    user.Id,
		ChannelId: createRequest.Args.ChannelID,
		Message:   postMsg,
		FileIds:   []string{fileToPost.Id},
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

func tempFileName(prefix string) string {
	randBytes := make([]byte, 16)
	rand.Read(randBytes)
	return filepath.Join(os.TempDir(), prefix+hex.EncodeToString(randBytes))
}
