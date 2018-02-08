import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import config from './config';

console.log('config.env', config.env);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
