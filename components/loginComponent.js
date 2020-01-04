import Component from "./component.js";
import store from '../store/index.js'
import link from "../routers/link.js";

export default class LoginComponent extends Component {
    constructor(app, settings) {
        super(store, app);
        this.app = app;
        this.settings = settings;
        this.userData = {};
        this.mount();
        store.events.subscribe('loginUser', this.loginUser);
    }
onDestroy() {
    super.onDestroy();

  //  console.log('onDestroy', store.events,this.anchor);
    store.events.unsubscribe('loginUser', this.loginUser);
    document.getElementById('app').innerHTML = '';
}

    loginUser() {
        console.log('authorized', store.state.userInfo);
        event.preventDefault();
        let users_data = {
            login: store.state.userInfo.login,
            password: store.state.userInfo.password,
        };
        //   console.log("LOGIN USER",users_data);
        const request = new Request('http://localhost:3000/api/login', {
            method: 'POST',
            mode: 'no-cors',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(users_data)
        });
        fetch(request)
            .then(response => {
                response.json()
                    .then(data => {
                        if (data.length === 0) {
                            alert('неправильно введен логин или пароль');
                            localStorage.clear();
                        } else {
                           // alert('Поздравляю, вы успешно вошли в систему!');
                            localStorage.clear();
                            localStorage.setItem(users_data.login, users_data.password);
                            //  console.log('STORE ADD USER', store.state.userInfo)
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            });
    }

    mount() {
        const template = document.getElementById('login').content.cloneNode(true);
        this.app.append(template);
        const login = this.app.querySelector('.login');
        const password = this.app.querySelector('.password');
        login.value = store.state.userInfo.login;
        password.value = store.state.userInfo.password;

        this.app.querySelector('.registrationPage').addEventListener('click', () => {
            link(this.settings.redirectRegistration)
        });
        this.app.querySelector('.signIn').addEventListener('click', () => {
            this.userData = {
                login: login.value,
                password: password.value
            };

            if (localStorage.length >= 1) {
                // console.log('REDIRECT');
                link(this.settings.redirectList)


            } else {
                store.dispatch('logIn', this.userData);
            }
        })
    }

    render() {
    }
}
