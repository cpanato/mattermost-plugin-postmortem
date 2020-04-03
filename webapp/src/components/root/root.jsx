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
            root_cause: null,
            what_happened: null,
            impact: null,
            responders: null,
            action_items: null,
            overview: '',
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.visible && state.message != null) {
            return {
                what_happened: null,
                root_cause: null,
                impact: null,
                responders: null,
                action_items: null,
                overview: ''
            };
        }
        return null;
    }

    submit = () => {
        const { submit, close, data } = this.props;
        const {
            overview,
            what_happened,
            root_cause,
            impact,
            responders,
            action_items
        } = this.state;

        submit(data, overview, what_happened, root_cause, impact, responders, action_items);
        close();
    }

    render() {
        const {visible, theme, close} = this.props;

        if (!visible) {
            return null;
        }

        const {
            overview,
            what_happened,
            root_cause,
            impact,
            responders,
            action_items,
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
                            {'Overview'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={overview}
                            placeholder='Summary of the incident'
                            onChange={(e) => this.setState({ overview: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'What Happened'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={what_happened}
                            placeholder='A description in what happened during the incident'
                            onChange={(e) => this.setState({ what_happened: e.target.value})}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Root Cause'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={root_cause}
                            placeholder='The root cause of the incident'
                            onChange={(e) => this.setState({ root_cause: e.target.value })}
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
                            placeholder='The impact of the incident'
                            onChange={(e) => this.setState({ impact: e.target.value })}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Responders'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={responders}
                            placeholder='Who respond or was involved during the incident'
                            onChange={(e) => this.setState({ responders: e.target.value })}
                        />
                    </div>
                    <div className='postmortem-item'>
                        <h2>
                            {'Action Items'}
                        </h2>
                        <textarea
                            className='postmortem-input'
                            style={style.textarea}
                            value={action_items}
                            placeholder='Actions Items if exist any'
                            onChange={(e) => this.setState({ action_items: e.target.value })}
                        />
                    </div>
                    <div className='postmortem-button-container'>
                        <button
                            className={'btn btn-primary'}
                            style={!overview || !what_happened || !root_cause || !impact ? style.inactiveButton : style.button}
                            onClick={this.submit}
                            disabled={!overview || !what_happened || !root_cause || !impact}
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