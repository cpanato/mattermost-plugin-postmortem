module github.com/cpanato/mattermost-plugin-postmortem

go 1.14

require (
	github.com/jung-kurt/gofpdf v1.16.2 // indirect
	github.com/mandolyte/mdtopdf v0.0.0-20190923134258-4400ba48c487
	github.com/mattermost/mattermost-server/v5 v5.20.0
	github.com/pkg/errors v0.9.1
	github.com/shurcooL/sanitized_anchor_name v1.0.0 // indirect
	github.com/stretchr/testify v1.5.1
	gopkg.in/russross/blackfriday.v2 v2.0.1 // indirect
)

replace gopkg.in/russross/blackfriday.v2 => github.com/russross/blackfriday/v2 v2.0.1
