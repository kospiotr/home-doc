Vue.component('entity', {
    props: ['entity'],
    computed: {
        type: function(){
            return this.$store.getters.typeById(this.entity.type)
        },
        direction: function(){
            return this.type && this.$store.getters.directionById(this.type.direction)
        }
    },
    template: `<div>
    <div v-if="entity.id">ID: {{entity.id}}</div>
    <div v-if="entity.name">Name: {{entity.name}}</div>
    <div v-if="direction">Kierunek: {{direction.label}}</div>
    <div v-if="type">Typ: {{type.label}}</div>
    <div>Kontrolowany: {{entity.controllable}}</div>
    </div>`
});
//    {{entity}}
