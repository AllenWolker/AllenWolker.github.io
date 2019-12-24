import store from "../store/index.js";

export  default class Component {
    constructor(store,anchor) {
        this._render_ = this.render.bind(this);
        this.anchor = anchor;
        store.events.subscribe('change', this._render_);
       // store.events.subscribe('filterTodo', this._render_);
       // console.log('component anchor', this.anchor);
    }
    onDestroy(){

        console.log('onDestroy', store.events,this.anchor);
        store.events.unsubscribe('change', this._render_);
      //  store.events.unsubscribe('filterTodo', this._render_);
        document.getElementById('app').innerHTML = '';
    }

}
