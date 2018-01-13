import {extendObservable, action, autorun } from "mobx";
import axios from "axios";

class Store {
    constructor() {
        extendObservable(this, {
            items: [],
            item: {},
            authenticated: false,
            authenticating: false,
            async fetchData(pathname) {
                let { data } = await axios.get(
                    `https://jsonplaceholder.typicode.com${pathname}`
                );
               this.setData(data);
            },
            async fetchItem(pathname, id) {
                this.item = {};
                let { data } = await axios.get(
                    `https://jsonplaceholder.typicode.com${pathname}/${id}`
                );
                this.setItem(data);
            },
            authenticate() {
                return new Promise((resolve, reject) => {
                    this.authenticating = true;
                    setTimeout(() => {
                        this.authenticated = !this.authenticated;
                        this.authenticating = false;
                        resolve(this.authenticated);
                    }, 0);
                });
            },
            setData: action(data => {
              this.items = data;
            }),
            setItem: action(data => {
                this.item = data;
            })
        })
    }
}
var store  = new Store()
export default store

autorun(() => {

})