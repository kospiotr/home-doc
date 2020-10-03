Vue.component('controller-page', {
    computed:{
        controller: function(){
            const id = this.$route.params.id;
            return this.$store.getters.controllers
                .find(controller => id && controller.id == id);
        }
    },
    template: `
    <div>
        <controller v-if="controller" :id="controller.id" expand="true"></controller>
</div>
    `
});
