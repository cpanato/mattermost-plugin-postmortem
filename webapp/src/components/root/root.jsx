import React from 'react';
import PropTypes from 'prop-types';

import {makeStyleFromTheme, changeOpacity} from 'mattermost-redux/utils/theme_utils';

import FullScreenModal from '../modals/full_screen_modal.jsx';

import './root.scss';

export default class Root extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired,
        close: PropTypes.func.isRequired,
        submit: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);

        this.state = {
            rootCause: null,
            timeline: null,
            impact: null,
            lessons: null,
            actionItems: null,
            recovery: null,
            overview: '',
        };
    }

    static getDerivedStateFromProps(props) {
        if (!props.visible) {
            return {
                timeline: null,
                rootCause: null,
                impact: null,
                lessons: null,
                actionItems: null,
                recovery: null,
                overview: '',
            };
        }
        return null;
    }

    submit = () => {
        const {submit, close, data} = this.props;
        const {
            overview,
            timeline,
            rootCause,
            impact,
            lessons,
            recovery,
            actionItems,
        } = this.state;

        submit(data, overview, timeline, rootCause, impact, recovery, lessons, actionItems);
        close();
    }

    render() {
        const {visible, theme, close} = this.props;

        if (!visible) {
            return null;
        }

        const {
            overview,
            timeline,
            rootCause,
            impact,
            lessons,
            recovery,
            actionItems,
        } = this.state;

        const style = getStyle(theme);

        return (
            <FullScreenModal
                show={visible}
                onClose={close}
            >
                <div
                    style={style.modal}
                    className='PostMortemRootModal'
                >
                    <h1>{'Post Mortem Template'}</h1>
                    <div className='postmortem-item'>
                        <h2>
                            {'Incident Summary'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={overview}
                            placeholder='Write a summary of the incident in a few sentences. Include what happened, why, the severity of the incident and how long the impact lasted.'
                            onChange={(e) => this.setState({overview: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Impact'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={impact}
                            placeholder='Describe how the incident impacted internal and external users during the incident. Include how many support cases were raised.'
                            onChange={(e) => this.setState({impact: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Timeline'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={timeline}
                            placeholder='Detail the incident timeline (UTC times preferable)\nWhen did the team detect the incident? How did they know it was happening? How could we improve time to detection?'
                            onChange={(e) => this.setState({timeline: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Root Cause'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={rootCause}
                            placeholder="Describe the sequence of events that lead to the incident, for example, previous changes that introduced bugs that had not yet been detected. Describe how the change that was implemented didn't work as expected."
                            onChange={(e) => this.setState({rootCause: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Recovery'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={recovery}
                            placeholder='Describe how the issue got resolved.'
                            onChange={(e) => this.setState({recovery: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Lessons Learned'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={lessons}
                            placeholder='Discuss what went well in the incident response, what could have been improved, and where there are opportunities for improvements.'
                            onChange={(e) => this.setState({lessons: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Action Items'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={actionItems}
                            placeholder='List the actions we’re taking to ensure that this same incident doesn’t reoccur.  The intent here is two thing:
- Define actions for ourselves to improve our product and process.
- Describe these actions in a way that gives customers a sense of comfort and clarity that the incident they just experienced won’t happen in the same way again.'
                            onChange={(e) => this.setState({actionItems: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-button-container'>
                        <button
                            className={'btn btn-primary'}
                            style={!overview || !timeline || !rootCause || !impact || !actionItems || !lessons || !recovery ? style.inactiveButton : style.button}
                            onClick={this.submit}
                            disabled={!overview || !timeline || !rootCause || !impact || !actionItems || !lessons || !recovery}
                        >
                            {'Create Post Mortem'}
                        </button>
                    </div>
                    <div className='postmortem-divider'/>
                    <div className='postmortem-clarification'>
                        <div className='postmortem-question'>
                            {'What is a postmortem report?'}
                        </div>
                        <div className='postmortem-answer'>
                            {'Depending on the organizational context, postmortems go by a number of names: project postmortems, postmortem documentation, completion report, project debriefing, or lessons learned.\nAs many of these names suggest, a postmortem report is a collaborative reflection that allows a team to assess the successes, challenges, and failures of a particular project after it is completed. In other words, it is an opportunity to conduct a retrospective analysis of work processes, team-collaboration, and technology use in the workplace. Importantly, postmortems are not used to lay blame on any employee. Rather, they are meant to identify and assess what went right, what went wrong, and what can be improved in future projects.'}
                        </div>
                        <div className='postmortem-question'>
                            {'The goal of a post-mortem report'}
                        </div>
                        <div className='postmortem-answer'>
                            {'It may seem odd to ask some of these questions at the end of a project. Why would anyone want to highlight weaknesses of a team endeavor? Again, the purpose of a post-mortem report is not to blame specific members of a team or to root out the specific cause of a difficulty encountered. Rather, post-mortems aim to improve work processes and project management by acknowledging what went right and what went wrong.'}
                        </div>
                    </div>
                </div>
            </FullScreenModal>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        modal: {
            color: changeOpacity(theme.centerChannelColor, 0.9),
        },
        textarea: {
            backgroundColor: theme.centerChannelBg,
        },
        helpText: {
            color: changeOpacity(theme.centerChannelColor, 0.6),
        },
        button: {
            color: theme.buttonColor,
            backgroundColor: theme.buttonBg,
        },
        inactiveButton: {
            color: changeOpacity(theme.buttonColor, 0.5),
            backgroundColor: changeOpacity(theme.buttonBg, 0.1),
        },
    };
});