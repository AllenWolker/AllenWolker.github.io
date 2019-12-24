import Component from "./component.js";
import store from '../store/index.js'
import link from "../routers/link.js";

export default class LoginComponent extends Component {
    constructor(app, settings) {
        super(store, app);
        this.app = app;
        this.settings = settings;
        this.mount();
        store.events.subscribe('registerUserToDB', this.addUser);
        store.events.subscribe('registerUserToDB', this.render);
    }
    onDestroy() {
        super.onDestroy();
        store.events.unsubscribe('registerUserToDB', this.addUser);
        store.events.unsubscribe('registerUserToDB', this.RedirectUser);
        document.getElementById('app').innerHTML = '';
    }
    mount() {
        const template = document.getElementById('registration').content.cloneNode(true);
        this.app.append(template);
        const login = this.app.querySelector('.login');
        const password = this.app.querySelector('.password');
        const repPassword = this.app.querySelector('.repPassword');
        const email = this.app.querySelector('.email');
        this.app.querySelector('.signUp').addEventListener('click', () => {

            let payload = {
                login: login.value,
                password: password.value,
                repPassword: repPassword.value,
                email: email.value
            };
            store.dispatch('registerUser', payload);
        });
        this.app.querySelector('.signIn').addEventListener('click', () => {
            link(this.settings.redirectLogin)
        })
    }

    RedirectUser() {
        console.log('REDIRECT USER TO LIST', this.settings);
        if (localStorage.length>0) link(this.settings.redirectList);

    }

    //добавление пользователя
    addUser() {
        event.preventDefault();
        let users_data = {
            login: store.state.userInfo.login,
            password: store.state.userInfo.password,
            repPassword: store.state.userInfo.repPassword,
            email: store.state.userInfo.email,
            id: Math.random().toFixed(4)
        };

        if (!users_data.password
            || !users_data.email
            || !users_data.login
            || !users_data.repPassword) {
            alert('Одно или несколько полей пусты, пожалуйста заполните их');
        } else if (users_data.password !== users_data.repPassword || users_data.password.length < 8) {
            alert('поля пароля не совпадают либо пароль слишком короткий(пароль должен быть минимум 8 символов)')
        } else {
            const request = new Request('https://136984a6.ngrok.io/api/new-user', {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify(users_data)
            });
            fetch(request)
                .then(response => {
                    response.json()
                        .then(data => {
                            if (data.detail) {
                                alert('Пользователь с таким логином уже существует, пожалуйста придумайте другой логин!');
                            } else {
                                localStorage.clear();
                                localStorage.setItem(users_data.login, users_data.password);
                                alert('Регистрация прошла успешно');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
        }

    }

    render() {
    }
}
