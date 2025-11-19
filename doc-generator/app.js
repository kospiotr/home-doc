const router = new VueRouter({
    routes: [
        { path: '/locations', component: Vue.component('locations-page') },
        { path: '/entities', component: Vue.component('entities-page') },
        { path: '/state', component: Vue.component('state-page') },
        { path: '/validation', component: Vue.component('validation-page') },
        { path: '/stats', component: Vue.component('stats-page') },
        { path: '/controllers', component: Vue.component('controllers-page') },
        { path: '/controllers/:id', component: Vue.component('controller-page') },
        { path: '/', component: Vue.component('main-page') }
    ]
})

const store = new Vuex.Store({
  state: {
    count: 0,
    data: {
    },
    filters: {
        places: [],
        directions: [],
        types: []
    },
    devices: {
        esp32: {
            slots: 24,
            portMapper: function(portIndex){
                switch(portIndex){
                    case 0: return 'GPIO36';
                    case 1: return 'GPIO39';
                    case 2: return 'GPIO34';
                    case 3: return 'GPIO35';
                    case 4: return 'GPIO32';
                    case 5: return 'GPIO33';
                    case 6: return 'GPIO25';
                    case 7: return 'GPIO26';
                    case 8: return 'GPIO27';
                    case 9: return 'GPIO14';
                    case 10: return 'GPIO12';
                    case 11: return 'GPIO13';
                    case 12: return 'GPIO15';
                    case 13: return 'GPIO2';
                    case 14: return 'GPIO0';
                    case 15: return 'GPIO4';
                    case 16: return 'GPIO16';
                    case 17: return 'GPIO17';
                    case 18: return 'GPIO5';
                    case 19: return 'GPIO18';
                    case 20: return 'GPIO19';
                    case 21: return 'GPIO21';
                    case 22: return 'GPIO22';
                    case 23: return 'GPIO23';
                }
                return portIndex+'aaa'
            }
        },
        esp64: {
            slots: 64,
            portMapper: function(portIndex){return portIndex}
        },
        esp128: {
            slots: 128,
            portMapper: function(portIndex){return portIndex}
        },
    }
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
    deviceById: (state, getters) => id => {
        return state.devices[id];
    },
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
        return (state.data.entities || [])
            .map((entity, index) => {
                const $location =  getters.locationById(entity.location)
                const $place = $location && getters.placeById($location.place)
                const $type = getters.typeById(entity.type)
                const $direction = $type && getters.directionById($type.direction)
                const sections = [entity.type, index];
                const id = sections.join('_');
                const $related = Object.values(entity.actions || {})
                    .flatMap(action => action)
                    .flatMap(operation => Object.values(operation))
                const controllable = $type && $type.controllable;
                return Object.assign({id, $location, $place, $type, $direction, $related, controllable},entity)
            }).filter(entity => entity.controllable)

    },
    entityById: (state,getters) => id => {
        return getters.entities.filter(value => id == value.id)[0];
    },
    controllers: (state, getters) => {
        return (state.data.controllers || []).map((controller, index) => {
            const id = controller.id ?  controller.id : "controller."+index
            const entities = getters.entities
                .filter(entity => {
                    const placeId = entity.$place && entity.$place.id;
                    return (controller.controlling || []).indexOf(placeId) > -1;
                 })
                 .filter(entity => entity.controllable)
            const inputs = entities.filter(entity => entity.$type.direction == 'input');
            const outputs = entities.filter(entity => entity.$type.direction == 'output');
            const device = getters.deviceById(controller.device);
            const slots = device.slots;
            const offset = slots / 2;
            const ports = [...Array(slots).keys()].map(port => {
                const entity = port < offset ?
                    inputs[port] :
                    outputs[port - offset];
                const $direction = entity && entity.$direction;
                return {
                    id: device.portMapper(port),
                    index: port,
                    entity,
                    $direction,
                    directionId: $direction && $direction.id
                }
            });
            const portRelations = ports.map( port => {
                const entity = port.entity;
                const relations = [];
                if(entity){
                    getters.relatedEntities(entity.id)
                        .forEach(relatedEntityId => {
                            const relatedPort = ports.find(port => {
                                const entityId = port.entity && port.entity.id;
                                return entityId && relatedEntityId == entityId;
                            });
                            relations.push({
                                entityId: relatedEntityId,
                                entity: getters.entityById(relatedEntityId),
                                portIndex: relatedPort && relatedPort.index,
                                port: relatedPort
                            });
                        });
                }
                return {port, relations};
            });
            return Object.assign({id, entities, ports, slots, portRelations},controller);
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