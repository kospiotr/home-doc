Vue.component('controller', {
    props: ['id', 'expand'],
    data: function(){
        return {
            collapsed: !this.expand
        }
    },
    watch:{
        'expand'(newValue, oldValue){
            this.collapsed = !newValue;
        }
    },
    computed: {
        controller: function(){
            return this.$store.getters.controllerById(this.id);
        },
        mapIds: function(){
            return (this.controller && this.controller.entities || [])
                .reduce((acc, entity)=>{
                    if(entity.$direction.id=='input'){
                        acc[0].push({id: entity.id})
                    }
                    if(entity.$direction.id=='output'){
                        acc[1].push({id: entity.id})
                    }
                    return acc;
                },[[],[]]);
        },
        stats: function(){
            return (this.controller && this.controller.entities || [])
                .reduce((acc, entity)=>{
                    if(entity.$direction.id=='input'){
                        acc.inputs++;
                    }
                    if(entity.$direction.id=='output'){
                        acc.outputs++
                    }
                    return acc;
                },{inputs: 0, outputs: 0})

        }
    },
    methods:{
        relatedEntities: function(entity){
            return this.$store.getters.relatedEntities(entity.id);
        },
        relatedPorts: function(entity){
            return this.relatedEntities(entity)
                .map(relatedEntityId => {
                    return (this.controller.entities || [])
                        .reduce((acc, value, index) => {
                            if(relatedEntityId == value.id){
                                acc.ports.push(index);
                            }
                            return acc;
                        },{entity: relatedEntityId, ports:[]})
                });
        }
    },
    template: `
        <div v-if="controller">
            <h2>Controller: {{controller.label}}</h2>
            <h3>Statystyki</h3>
            <h4>Wejść: {{stats.inputs}}, Wyjść: {{stats.outputs}}, Suma: {{stats.inputs + stats.outputs}}</h4>
            <h3>Sloty</h3>
            <slots :slots="controller.slots"></slots>
            <h3>Statystyki</h3>
            <place-with-type-stats :entities="controller.entities"></place-with-type-stats>
            <br/>
            <place-with-direction-stats :entities="controller.entities"></place-with-direction-stats>
            <h3>Mapa</h3>
            <center><entity-map :ids="mapIds" :width="850" :height="800" :borders="100"></entity-map></center>
            <h3>Szczegóły</h3>
            <div>
                <button type="button" @click="collapsed=!collapsed">{{collapsed ? 'Rozwiń' : 'Zwiń'}}</button>
            </div>
            <table v-show="!collapsed">
                <tr>
                    <th>Port</th><th>Encja</th><th>Lokalizacja</th><th>Powiązania</th>
                </tr>
                <tr v-for="entity,index of controller.entities">
                    <td>{{index}}</td>
                    <td><entity :entity="entity"></entity></td>
                    <td>
                        <location :id="entity.location"></location>
                        <location-slot :index="entity.slot" :location="entity.location"></location-slot>
                    </td>
                    <td>
                        <h3>Powiązania</h3>
                        <ul>
                            <li v-for="relation in relatedPorts(entity)">{{relation.entity}} => <span v-bind:style="{backgroundColor: relation.ports.length > 0 ? 'lightgreen' : 'red'}">{{relation.ports.length > 0 ? relation.ports.join(', ') : 'BRAK'}}</span></li>
                        </ul>
                        <action :entity-id="entity.id"></action></td>
                </tr>
            </table>
        </div>
    `
})