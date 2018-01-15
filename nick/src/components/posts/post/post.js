import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {  Link } from "react-router-dom";
import Protected from '../../guard/protected';
import '../posts.css';
class Post extends Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
    }
    componentWillMount() {

       this.store.fetchItem('/posts', this.props.match.params.id);

    }
    render() {
        const  item = this.store.item;

        return (
            <div className="page post">
                <Link to="/posts">← Back to Posts</Link>
                {item.title ?  <article>
                    <h1>{item.title}</h1>
                    <p>{item.body}</p>
                </article> : "Loading..."}

            </div>
        );
    }
}
export default (inject('store')) (Protected(observer(Post)))
