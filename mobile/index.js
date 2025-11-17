/**
 * FamilyUp Mobile Entry Point
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from '../package.mobile.json';

AppRegistry.registerComponent(appName, () => App);
