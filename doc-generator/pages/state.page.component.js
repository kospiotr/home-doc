Vue.component('state-page', {
    computed:{
        entities: function(){
            return this.$store.getters.entities
        }
    },
    template: `
    <div>
        <h1>State</h1>
<pre><code>
    {{entities}}
</code></pre>
</div>
    `
});