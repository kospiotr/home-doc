const router = new VueRouter({
    routes: [
        { path: '/locations', component: Vue.component('locations-page') },
        { path: '/entities', component: Vue.component('entities-page') },
        { path: '/state', component: Vue.component('state-page') },
        { path: '/validation', component: Vue.component('validation-page') },
        { path: '/stats', component: Vue.component('stats-page') },
        { path: '/controllers', component: Vue.component('controllers-page') },
        { path: '/', component: Vue.component('main-page') }
    ]
})

const store = new Vuex.Store({
  state: {
    count: 0,
    data: {},
    filters: {
        places: [],
        directions: [],
        types: []
    },
  },
  mutations: {
    load (state, data) {
        state.data = data;
        state.filters.places = store.getters.places.map(entry => entry.id);
        state.filters.directions = store.getters.directions.map(entry => entry.id);
        state.filters.types = store.getters.types.map(entry => entry.id);
    },
    updateFilterPlaces (state, data) {
        state.filters.places = data
    },
    updateFilterDirections (state, data) {
        state.filters.directions = data
    },
    updateFilterTypes (state, data) {
        state.filters.types = data
    }

  },
  getters: {
    actions: (state, getters) => {
        return Object.entries(state.data.actions || {})
            .map(entry => {return Object.assign({id: entry[0]},entry[1])})
    },
    actionById: (state,getters) => id => {
        return getters.actions.filter(value => id == value.id)[0];
    },
    places: (state, getters) => {
        return Object.entries(state.data.places || {})
            .map(entry => {return Object.assign({id: entry[0]},entry[1])})
            .concat([{label: 'Inny'}])
    },
    placeById: (state,getters) => id => {
        return getters.places.filter(value => id == value.id)[0];
    },
    directions: (state, getters) => {
        return Object.entries(state.data.directions || {})
            .map(entry => {return Object.assign({id: entry[0]},entry[1])})
            .concat([{label: 'Inny'}])
    },
    directionById: (state,getters) => id => {
        return getters.directions.filter(value => id == value.id)[0];
    },
    types: (state, getters) => {
        return Object.entries(state.data.types || {})
            .map(entry => {return Object.assign({id: entry[0]},entry[1])})
            .concat([{label: 'Inny'}])
    },
    typeById: (state,getters) => id => {
        return getters.types.filter(value => id == value.id)[0];
    },
    locations: (state, getters) => {
        return Object.entries(state.data.locations || {})
            .map(entry => {return Object.assign({id: entry[0]}, entry[1])});
    },
    locationById: (state,getters) => id => {
        return getters.locations.filter(value => id == value.id)[0];
    },
    entities: (state, getters) => {
        return (state.data.entities || []).map((entity, index) => {
            const $location =  getters.locationById(entity.location)
            const $place = $location && getters.placeById($location.place)
            const $type = getters.typeById(entity.type)
            const $direction = $type && getters.directionById($type.direction)
            const sections = [entity.type, index];
            const id = sections.join('.');
            const $related = Object.values(entity.actions || {})
                .flatMap(action => action)
                .flatMap(operation => Object.values(operation))
            const controllable = $type && $type.controllable;
            return Object.assign({id, $location, $place, $type, $direction, $related, controllable},entity)
        })
    },
    entityById: (state,getters) => id => {
        return getters.entities.filter(value => id == value.id)[0];
    },
    controllers: (state, getters) => {
        return (state.data.controllers || []).map((controller, index) => {
            const entities = getters.entities
                .filter(entity => {
                    const placeId = entity.$place && entity.$place.id;
                    return (controller.controlling || []).indexOf(placeId) > -1;
                 })
                 .filter(entity => entity.controllable)
            return Object.assign({id: "controller."+index, entities},controller);
        })
    },
    controllerById: (state,getters) => id => {
        return getters.controllers.filter(value => id == value.id)[0];
    },
    relatedEntities: (state, getters) => id => {
        var out = [];
        const entity = getters.entityById(id);
        out = out.concat(entity && entity.$related || [])
        out = out.concat(getters.entities
            .filter(entity => (entity && entity.$related || []).indexOf(id) > -1)
            .map(entity => entity.id))
        return out;
    }
  }
})

new Vue({
    el: "#app",
    router: router,
    store: store,
    methods: {
        load: function() {
            axios.get('doc.yaml').then(resp => {
                jsyaml.safeLoadAll(resp.data, data => {
                    this.$store.commit('load', data)
                });
            })
        }
    },
    created: function() {
        this.load();
    }

})