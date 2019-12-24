import Observer from "./observer.js";

const status = response => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
};
const json = response => response.json();

export default class Store {
    constructor(reducers) {
        this.reducers = reducers;
        this.state = {
            todo: [],
            idx: [],
            filterTodo:[],
            filterTrigger: false,
            update: [],
            userInfo: {
                login: 'qwe4',
                password: '12341234',
                repPassword:'',
                email: '',
                authorised: true,
            },

    };
        this.events = new Observer();
    this.componentDidMount();
    }
    componentDidMount() {
        this.state.todo = [];
        console.log('Component has mounted');
        fetch('http://136984a6.ngrok.io/api/list')
            .then(status)
            .then(json)
            .then(data => {
                   this.dispatch('addItems', data );
                console.log('Request succeeded with JSON response',  data);
            })
            .catch(error => {
                console.log('Request failed', error);
            });
    }

    dispatch(actionType, payload){
      //  console.log('dispatch',actionType,payload, this.state);
        if(this.reducers[actionType] ){
            if(this.reducers[actionType] !== 'removeServerItem'|| this.reducers[actionType] !== 'updateServerTodoList'){
                this.state = this.reducers[actionType](payload,this.state);
            }
         //   console.log('state',this.state,'actionType',actionType);
            if(actionType === 'addItem'||
                actionType === 'addItems'||
                actionType === 'removeItem'||
                actionType === 'filterTodoList'||
                actionType === 'clearFilterTodoList'||
                actionType ==='updateTodoList'){
                console.log('change Store',actionType, this.state, payload);
                this.events.next('change',this.state);
            }
            if( actionType === 'updateServerTodoList'){
                console.log('updateSERVERTodoList Store',this.state,  payload);
                this.events.next('updateServerTodoData',payload);
            }
            if( actionType === 'registerUser'){
                console.log('Remove Store',this.state,  payload);
                this.events.next('registerUserToDB',payload);
            }
             if( actionType === 'removeServerItem'){
                 console.log('Remove Store',this.state,  payload);
                 this.events.next('removeTodoList',payload);
             }
            if(actionType === 'addUpdateItem'){
                console.log('Update Store',this.state, );
                this.events.next('updateTodoData',this.state);
            }
            if(actionType === 'reloadTodoList'){
                console.log('INSTALL Store',this.state, );
               this.componentDidMount();
            }
            if(actionType === 'logIn'){
                console.log('logIn Store',this.state, );
                this.events.next('loginUser',this.state);
            }
            if(actionType === 'addItem'){
                console.log('addTodoData Store',this.state );
                this.events.next('addTodoData',this.state);
            }

        }
    }
}
