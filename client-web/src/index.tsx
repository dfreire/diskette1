import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'antd/dist/antd.css';
import config from './config';
import gun from './init-gun';

console.log('config.env', config.env);
console.log('gun', gun);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
