import React, { Component } from 'react';
import { Route, withRouter} from "react-router-dom";
import { inject, observer } from "mobx-react";
import LazyRoute from 'react-lazy-route';
import Home from './home/home';
import Header from './header/header';
import Posts from './posts/posts';
import Post from './posts/post/post';
class App extends Component {
    render() {
        return (
 <div>
     <div className="wrapper">
         <Header/>
         <Route
             exact
             path="/"
             render={props => (
                 <LazyRoute {...props} component={Home} />
             )}
         />
         <Route
             exact
             path="/posts"
             render={props => (
                 <LazyRoute {...props} component={Posts} />
             )}
         />
         <Route
             exact
             path="/posts/:id"
             render={props => (
                 <LazyRoute {...props} component={Post} />
             )}
         />
         <footer>
             <a href="http://www.nickverstocken.be" target="_blank" rel="noopener noreferrer">
                 nickverstocken.be&nbsp;
             </a>
             | github:
             <a href="https://github.com/nickverstocken" target="_blank" rel="noopener noreferrer">
                 nickverstocken
             </a>
         </footer>
     </div>
 </div>
        );
    }
}

export default (inject('store')) (withRouter(observer(App)));