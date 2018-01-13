import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from "mobx-react";
import {BrowserRouter as Router} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import store from './stores/store';

ReactDOM.render(


    <Router>
        <Provider store={store}>
       <App/>
        </Provider>
    </Router>

    , document.getElementById('root'));
registerServiceWorker();
