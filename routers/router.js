import routerConfig from "./routerConfig.js";

export default  class  Router {
    constructor(anchor) {
       this.anchor = anchor;
        window.addEventListener('popstate',event =>{
            this.changeRoute(event.state.route)
        })
    }
    changeRoute(route){
        const config = routerConfig[route];
     //   console.log('component route', this.component);
        if(!config) return;
        if (this.component){
            this.component.onDestroy();
        }
        window.history.pushState(config.data, '', config.url);
        this.component = new config.component(this.anchor, config.settings);
      //  console.log('component route',this.anchor, config.settings );
        this.component.render();
    }
}

