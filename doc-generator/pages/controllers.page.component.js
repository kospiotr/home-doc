Vue.component('controllers-page', {
    data:function(){
        return {
            expand: false
        }
    },
    computed:{
        controllers: function(){
            return this.$store.getters.controllers;
        }
    },
    template: `
    <div>
        <h1>Kontrolery</h1>
        <button type="button" @click="expand=!expand">{{expand ? 'Zwiń' : 'Rozwiń'}}</button>
        <controller v-for="controller in controllers" :id="controller.id" :expand="expand"></controller>
</div>
    `
});
