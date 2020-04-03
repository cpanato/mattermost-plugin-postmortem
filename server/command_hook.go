package main

import (
	"fmt"
	"strings"

	"github.com/pkg/errors"

	"github.com/mattermost/mattermost-server/v5/model"
	"github.com/mattermost/mattermost-server/v5/plugin"
)

const (
	commandTriggerPostMortem = "post-mortem"
	commandPostMortemHelp    = "Use this command to help you to create a post mortem report"
)

func (p *Plugin) registerCommands() error {
	if err := p.API.RegisterCommand(&model.Command{
		Trigger:          commandTriggerPostMortem,
		AutoComplete:     true,
		AutoCompleteDesc: commandPostMortemHelp,
		DisplayName:      "Create a post mortem report",
	}); err != nil {
		return errors.Wrapf(err, "failed to register %s command", commandTriggerPostMortem)
	}
	return nil
}

func (p *Plugin) deRegisterCommands() error {
	if err := p.API.UnregisterCommand("", commandTriggerPostMortem); err != nil {
		return errors.Wrapf(err, "failed to de-register %s command", commandTriggerPostMortem)
	}
	return nil
}

// ExecuteCommand executes a command that has been previously registered via the RegisterCommand
// API.
func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	trigger := strings.TrimPrefix(strings.Fields(args.Command)[0], "/")

	if trigger == commandTriggerPostMortem {
		return &model.CommandResponse{}, nil
	}

	return &model.CommandResponse{
		ResponseType: model.COMMAND_RESPONSE_TYPE_EPHEMERAL,
		Text:         fmt.Sprintf("Unknown command: " + args.Command),
	}, nil
}
