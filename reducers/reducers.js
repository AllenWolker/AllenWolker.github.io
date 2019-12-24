export default function createReducers() {
    return {
        addItem: (payload, state) => ({
            ...state,
            todo: [...state.todo, payload],
            idx: [...state.idx, state.idx[state.idx.length-1]+1],
        }),
        addItems: (payload, state) => ({
            ...state,
            todo: payload.map((item) => item.data),
            idx: payload.map((item) => item.id)
        }),
        removeServerItem: (payload, state) => ({
            ...state,
        }),
        removeItem: (payload, state) => ({
            ...state,
            todo: [
                ...state.todo.slice(0, payload.id),
                ...state.todo.slice(payload.id + 1, state.todo.length),
            ],
            idx: [
                ...state.idx.slice(0, payload.id),
                ...state.idx.slice(payload.id + 1, state.todo.length),
            ]

        }),
        addUpdateItem: (payload, state) => ({
            ...state,
            update: [ state.todo[payload.id], payload.id, state.idx[payload.id]
            ],

        }),
         updateTodoList: (payload, state) => ({
             ...state,
           todo:[
               ...state.todo.slice(0, payload.id),
               payload.data,
               ...state.todo.slice(payload.id+1, state.todo.length+1)
           ],

         }),
        updateServerTodoList: (payload, state) => ({
            ...state,

        }),
        filterTodoList: (payload, state) => ({
            ...state,
            filterTrigger: true,
            filterTodo:[...state.todo.filter(filt => filt === payload ) ]
        }),
        clearFilterTodoList: (payload, state) => ({
            ...state,
            filterTrigger: payload,
            filterTodo:[]
        }),
        logIn: (payload, state) => ({
            ...state,
            userInfo: { ...state.userInfo,
                authorised: false,
                ...payload
            }
        }),

        logOut: (payload, state) => ({
            ...state,
            userInfo: {}
        }),
        registerUser: (payload, state) => ({
            ...state,
            userInfo: {
                authorised: true,
                ...payload,
            }
        }),
    }
}


