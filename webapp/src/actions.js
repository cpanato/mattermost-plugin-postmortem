import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {id as pluginId} from './manifest';
import {OPEN_ROOT_MODAL, CLOSE_ROOT_MODAL} from './action_types';

export const openRootModal = (data) => (dispatch) => {
    dispatch({
        type: OPEN_ROOT_MODAL,
        data,
    });
};

export const closeRootModal = () => (dispatch) => {
    dispatch({
        type: CLOSE_ROOT_MODAL,
    });
};

export const getPluginServerRoute = (state) => {
    const config = getConfig(state);

    let basePath = '/';
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;

        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }

    return basePath + '/plugins/' + pluginId;
};

// export const create = (type, title, body, postID) => async (dispatch, getState) => {
export const create = (args, overview, what_happened, root_cause, impact, responders, action_items) => async (dispatch, getState) => {
    fetch(getPluginServerRoute(getState()) + '/create', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ args, overview, what_happened, root_cause, impact, responders, action_items }),
    });
};