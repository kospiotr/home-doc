Vue.component('action', {
    props: ['entityId'],
    computed: {
        entity: function(){
            return this.$store.getters.entityById(this.entityId)
        },
        actions: function(){
            return ((this.entity && this.entity.actions) || [])
        },
        parties: () => function(operations){
            const targets = operations
                .flatMap(operation => Object.values(operation))
                .map(id => {return [{id: id}]})
            targets.unshift([{id: this.entityId}])
            return targets
        }
    },
    methods:{
        lookupAction: function(id){
            return this.$store.getters.actionById(id).label
        },
        flat: function(input){
            return input
                .flatMap(input => Object.entries(input))
                .map(entry => {
                    return {key: entry[0], value: entry[1]}
                })
        }
    },
    template: `
    <div>
        <div v-for="operations,actionKey in actions">
            <entity-map :ids="parties(operations)"></entity-map>
            <div>{{lookupAction(actionKey)}}</div>
            <ul>
                <li v-for="operation in flat(operations)">{{lookupAction(operation.key)}}: {{operation.value}}</li>
            </ul>
        </div>
    </div>`
});