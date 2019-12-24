import listComponent from "../components/listComponent.js";
import LoginComponent from "../components/loginComponent.js";
import RegistrationComponent from "../components/registrationComponent.js";
import updateTodoComponent from "../components/updateTodoComponent.js";

export default {
    'login': {
        data: {route: 'login'},
        url: 'login',
        component: LoginComponent,
        settings: {
            redirectList: 'list',
            redirectRegistration: 'registration',
            redirectLogin: 'login',
        },
    },
    'registration': {
        data: {route: 'registration'},
        url: 'registration',
        component: RegistrationComponent,
        settings: {
            redirectList: 'list',
            redirectRegistration: 'registration',
            redirectLogin: 'login',
        },
    },
    'list': {
        data: {route: 'list'},
        url: 'list',
        component: listComponent,
        settings: {
            redirectList: 'list',
            redirectRegistration: 'registration',
            redirectLogin: 'login',
            redirectUpdateTodo: 'update'
        },
    },
    'update': {
        data: {route: 'update'},
        url: 'update',
        component: updateTodoComponent,
        settings: {
            redirectList: 'list',
            redirectRegistration: 'registration',
            redirectLogin: 'login',
        },
    }
}
