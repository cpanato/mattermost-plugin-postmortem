module github.com/cpanato/mattermost-plugin-postmortem

go 1.13

require (
	github.com/mattermost/mattermost-server/v5 v5.20.0
	github.com/pkg/errors v0.9.1
	github.com/stretchr/testify v1.5.1
)

// Workaround for https://github.com/golang/go/issues/30831 and fallout.
replace github.com/golang/lint => github.com/golang/lint v0.0.0-20190227174305-8f45f776aaf1
