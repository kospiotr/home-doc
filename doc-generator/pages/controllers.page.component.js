Vue.component('controllers-page', {
    computed:{
        controllers: function(){
            return this.$store.getters.controllers;
        }
    },
    template: `
    <div>
        <h1>Kontrolery</h1>
        <controller v-for="controller in controllers" :id="controller.id"></controller>
</div>
    `
});
