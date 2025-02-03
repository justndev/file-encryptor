/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import store from './src/store';

export default function Main() {
    return (
        <Provider store={store}>
            <App />
        </Provider>

    );
}

AppRegistry.registerComponent(appName, () => Main);
