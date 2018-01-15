import React, { Component } from "react";
import {NavLink, withRouter} from 'react-router-dom';
import { inject, observer } from "mobx-react";
import './header.css';
import Button from "../ui/button";
class Header extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    authenticate(e) {
        if (e) e.preventDefault();
        console.log("CLICKED BUTTON");
        this.store.authenticate();
    }

    render() {
        const { authenticated } = this.store;
        return (
            <header className="topbar">
                <nav>
                    <ul>
                        <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
                        {authenticated ? <li><NavLink activeClassName="active" to="/posts">Posts</NavLink></li> : ''}
                    </ul>
                </nav>
                <Button
                    onClick={this.authenticate.bind(this)}
                    title={authenticated ? "Log out" : "Sign in"}
                />
            </header>
        );
    }
}
export default (inject('store')) (withRouter(observer(Header)));