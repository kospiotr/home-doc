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
            const out = this.$store.getters.controllerById(this.id);
            console.log(out);
            return out;
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
    template: `
        <div v-if="controller">
            <h2>Controller</h2>
            <div>
                <div>ID: <router-link :to="'/controllers/'+controller.id">{{controller.id}}</router-link></div>
                <div>Label: {{controller.label}}</div>
            </div>
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
                <tr v-for="port of controller.ports">
                    <td v-bind:class="{input: port.directionId == 'input', output: port.directionId == 'output', error: !(port.directionId)}">{{port.index}}</td>
                    <td><entity :entity="port.entity" v-if="port.entity"></entity></td>
                    <td>
                        <location :id="port.entity.location" v-if="port.entity"></location>
                        <location-slot :index="port.entity.slot" :location="port.entity.location" v-if="port.entity"></location-slot>
                    </td>
                    <td>
                        <div v-if="port.entity">
                            <h3>Akcje</h3>
                            <action :entity-id="port.entity.id"></action>
                            <div v-if="controller.portRelations[port.index]">
                                <h3>Relacje portów</h3>
                                <ul>
                                    <port-relation
                                        :relation="portRelation"
                                         v-for="portRelation in controller.portRelations[port.index].relations"></port-relation>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `
})