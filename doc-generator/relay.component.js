Vue.component('relay', {
    props: ['index'],
    data: function(){
        return {
            colors: ['dark-orange', 'light-orange', 'dark-green', 'light-green', 'dark-blue', 'light-blue', 'dark-brown', 'light-brown']
        };
    },
    computed: {
        groupWire:function(){return Math.floor((this.index -1)  / 8) + 1},
        wire:function(){return ((this.index - 1) % 8) + 1},
        color:function(){ return this.colors[this.wire - 1]},
    },
    template: `
        <div v-if="index">
            <h3>Przekaźnik</h3>
            <div>Index: {{index}}.</div>
            <div>Kabel zbiorczy: {{groupWire}}.</div>
            <div>Przewód: {{wire}}.</div>
            <div>Kolor przewodu: {{color}}.</div>
        </div>
    `
})