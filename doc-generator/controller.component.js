Vue.component('controller', {
    props: ['id'],
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

        }
    },
    template: `
        <div v-if="controller">
            <h2>Controller</h2>
            <slots :slots="controller.slots"></slots>
            <center><entity-map :ids="mapIds" :width="850" :height="800" :borders="100"></entity-map></center>
            <div>
                Wejść: {{stats.inputs}}, Wyjść: {{stats.outputs}}, Suma: {{stats.inputs + stats.outputs}}
            </div>
            <table>
                <tr>
                    <th>Port</th><th>Encja</th><th>Encje powiązane</th><th>Porty powiązane</th>
                </tr>
                <tr v-for="entity,index of controller.entities">
                    <td>{{index}}</td>
                    <td><entity :entity="entity"></entity></td>
                    <td>relatedEntities(entity)</td>
                    <td></td>
                </tr>
            </table>
        </div>
    `
})