import Component from "./component.js";
import store from '../store/index.js'
import link from "../routers/link.js";

export default class ListComponent extends Component {
    constructor(app, settings) {
        super(store);
        this.app = app;
        this.settings = settings;
        this.mount();
        this.anchor = document.querySelector('.js-items');
        store.events.subscribe('addTodoData', this.addTodoData);
        store.events.subscribe('removeTodoList', this.removeTodoList);
    }
    onDestroy() {
        super.onDestroy();
        store.events.unsubscribe('addTodoData', this.addTodoData);
        store.events.unsubscribe('removeTodoList', this.removeTodoList);
        document.getElementById('app').innerHTML = '';
    }

    addTodoData() {
        event.preventDefault();
        let list_data = {
            data: store.state.todo[store.state.todo.length - 1],
            id: store.state.idx[store.state.idx.length-1]
        };
        console.log('list data', list_data);
        if (!list_data) {
            alert('Пусто');
        } else {
            const request = new Request('https://136984a6.ngrok.io/api/new-list', {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify(list_data)
            });

            fetch(request)
                .then(response => {
                    response.json()
                        .then(data => {
                            if (data.detail) {
                                console.log('detail err', data.detail)
                            } else {

                                alert(' новая запить успешно добавлена')
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
        }
    }


//удаление todo записи
    removeTodoList(idx) {
        let that = this;
        let id = idx;
        let todoList = store.state.todo[id];
        console.log('deleted todo', todoList, id);
        let request = new Request('https://136984a6.ngrok.io/api/list/remove/' + id, {
            method: 'DELETE'
        });
        fetch(request)
            .then(response => {
                response.json()
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })

    }

    mount() {
        const template = document.getElementById('list').content.cloneNode(true);
        this.app.append(template);
        const input = document.querySelector('.add-input-field');
        const submitButton = document.querySelector('.add-button');
        const filterButton = document.querySelector('.filter-button');
        const clearButton = document.querySelector('.filter-clear-button');
        const filterInput = document.querySelector('.filter');
        const message = document.querySelector('.message');
        const handleClick = event => {
            event.preventDefault();
            let value = input.value.trim();
            if (value.length) {
                console.log('AddEvent', value);
                store.dispatch('addItem', value);
                input.focus();
                input.value = '';
            }
        };
        submitButton.addEventListener('click', handleClick);
        clearButton.addEventListener('click', event =>{
            event.preventDefault();
            filterInput.value = '';
           store.dispatch('clearFilterTodoList', false)
        });
        filterButton.addEventListener('click', (event)=>{
            event.preventDefault();
                let value = filterInput.value.trim();
                if(value.length){
                    console.log('FILTEREvent', value);
                    store.dispatch('filterTodoList', value);
                    let span = document.getElementById('message');
                    if(span){
                        span.innerHTML = '';
                    }
                } else{
                    let span = document.createElement('span');
                    message.before(span);
                    span.id = 'message';
                    console.log('ERRORFILTEREvent', value);
                    span.style.color = 'red';
                    span.innerHTML = 'Пусто...';

                }

            }
        );
        this.app.querySelector('.logOut').addEventListener('click', () => {
            localStorage.clear();
            link(this.settings.redirectLogin)
        });
    }

    render() {

        if (store.state.todo.length === 0) {
            //   console.log('achor List',this.anchor);
            this.anchor.innerHTML = 'No todos';
            return;
        }
        //сдесь храняться идшники из бд
        let idxTodoData = store.state.idx;
       // console.log('render ListData', store.state.todo, store.state.idx);
        this.anchor.innerHTML = `  
                <h1>Todo List for ${ store.state.userInfo.login }</h1>     
            <ul class ='todo'>
            ${
            store.state.filterTrigger?
                store.state.filterTodo.map((item, id) =>
                    `
                <li class="${idxTodoData[id]}" >${item} 
                 <button type="button" name="${idxTodoData[id]}" class="edit-button">...</button>
                <button type="button" class="delete-button" id="${idxTodoData[id]}">X</button>
            `).join('')
                :
            store.state.todo.map((item, id) =>
                `
                <li class="${idxTodoData[id]}" >${item} 
                 <button type="button" name="${idxTodoData[id]}" class="edit-button">...</button>
                <button type="button" class="delete-button" id="${idxTodoData[id]}">X</button>
            `).join('')
            }            
</ul>
        `;
        this.anchor.querySelectorAll('.edit-button').forEach((editBtn, id) =>
            editBtn.addEventListener('click', () => {
                link(this.settings.redirectUpdateTodo);
                    store.dispatch('addUpdateItem', {id});
                }
            )
        );
        this.anchor.querySelectorAll('.delete-button').forEach((button, id) =>
            button.addEventListener('click', () => {
                    store.dispatch('removeItem', {id});
                    store.dispatch('removeServerItem', button.id)
                }
            )
        )
    }
}
