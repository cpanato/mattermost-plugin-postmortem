import {id as pluginId} from './manifest';

import Root from './components/root';

import {openRootModal} from './actions';
import reducer from './reducer';

export default class Plugin {
    initialize(registry, store) {
        registry.registerRootComponent(Root);
        registry.registerReducer(reducer);

        registry.registerSlashCommandWillBePostedHook((message, args) => {
            if (message && message.startsWith('/post-mortem')) {
                store.dispatch(openRootModal(args));
                return Promise.resolve({});
            }
            return Promise.resolve({message, args});
        });
    }
}

window.registerPlugin(pluginId, new Plugin());
