Vue.component('port-relation',{
    props: ['relation'],
    computed:{
        direction: function(){
            const port = this.relation.port;
            const entity = port && port.entity;
            const direction = entity && entity.$direction;
            return direction && direction.id;
        }
    },
    template: `<li>
        {{relation.entityId}} =>
        <span v-bind:class="{input: direction == 'input', output: direction == 'output', error: !direction}">
        {{relation.portIndex == undefined ? 'ERROR' : relation.portIndex}}
        </span>
        </li>
    `
});
//        {{relation}}
