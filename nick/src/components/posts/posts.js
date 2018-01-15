import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {  Link } from "react-router-dom";
import Protected from '../guard/protected';
import './posts.css';

class Posts extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    componentWillMount() {
        this.store.fetchData('/posts');
    }
    render() {
        const  items = this.store.items;

        return (
            <div className="page posts">
                <h1>Posts</h1>
                <p className="subheader">
                    Posts are fetched from jsonplaceholder.typicode.com
                </p>
                <hr />
                <ul>
                    {
                        items && items.length
                        ? items.slice(6, 12).map(post => {
                            return (
                                <li key={post.id}>
                                    <Link
                                        to={`${this.props.match.path}/${post.id}`}
                                    >
                                        <h2>{post.title}</h2>
                                    </Link>
                                    <p>{post.body.substring(0, 120)}</p>
                                </li>
                            );
                        })
                        : "Loading..."}
                </ul>
            </div>
        );
    }
}
export default (inject('store')) (Protected(observer(Posts)))
