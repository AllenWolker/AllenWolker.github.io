import ListComponent from "./components/listComponent.js";
import store from "./store/index.js";
import Router from "./routers/router.js";

const router = new Router(document.getElementById('app'));
window.addEventListener('changeRoute', event => router.changeRoute(event.detail.route));
window.dispatchEvent(new CustomEvent('changeRoute',{detail:{route:'login'}}));

/*
const input = document.querySelector('.c-input-field');
const submitButton = document.querySelector('.c-button');

submitButton.addEventListener('click', event=>{
    event.preventDefault();
    let value = input.value.trim();
   if(value){
       console.log('AddEvent', value);
       store.dispatch('addItem', value);
       input.focus();
   }
});

const list = new ListComponent();
list.render();
*/
