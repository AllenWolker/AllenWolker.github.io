import Component from "./component.js";
import store from '../store/index.js'
import link from "../routers/link.js";

export default class UpdateTodoComponent extends Component {
    constructor(app, settings) {
        super(store, app);
        this.app = app;
        this.settings = settings;
        this.mount();
        store.events.subscribe('updateServerTodoData', this.updateTodoData);
        store.events.subscribe('updateTodoData', this.render);
    }
onDestroy() {
    super.onDestroy();
    store.events.unsubscribe('updateServerTodoData', this.updateTodoData);
    store.events.unsubscribe('updateTodoData', this.render);
    document.getElementById('app').innerHTML = '';
    }

    updateTodoData(data) {
        event.preventDefault();
       // console.log('DATA UPDATE', data);
        let list_data = {
            data: data.data,
            id: store.state.update[2]
        };
        console.log('UPDATE LIST DATA', list_data);
        if (!list_data) {
            alert('Пусто');
        } else {
            const request = new Request('http://localhost:3000/api/update-list', {
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
                                alert('  запить успешно изменена')
                            }

                            //console.log(data);
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
        }
    }

    mount() {
        const template = document.getElementById('update-todo').content.cloneNode(true);
        this.app.append(template);
        //   const updateInput = this.app.querySelector('#update-todo-list');
        const input = document.querySelector('.update-todo-list');

        const handleClick = event => {
            // event.preventDefault();
            let value = input.value.trim();
            let payload = {
                id: input.id,
                data: value,
                idDB: store.state.update[2],
            };
            if (value.length) {
                //  console.log('AddEvent', value);
                store.dispatch('updateServerTodoList', payload);
                store.dispatch('updateTodoList', payload);

                link(this.settings.redirectList);
            }
        };

        this.app.querySelector('#submit-change').addEventListener('click', handleClick);
        this.app.querySelector('#cancel-change').addEventListener('click', () => {
            link(this.settings.redirectList)
        });
    }

    render() {
        //console.log('update Input',store.state.update);
        const updateInput = document.querySelector('.update-todo-list');
        updateInput.value = store.state.update[0];
        updateInput.id = store.state.update[1];
    }
}
