import { AppRegistry, View, YellowBox } from 'react-native';
import Lifekeyrn from './App/Lifekeyrn';

YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated in plain JavaScript React classes.'
]);

AppRegistry.registerComponent('Lifekeyrn', () => Lifekeyrn);
