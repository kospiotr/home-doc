Vue.component('locations-page', {
    computed:{
        locations: function(){
            return this.$store.getters.locations
        }
    },
    template: `
<div><h1>Lokalizacje</h1>
    <table>
        <tr>
            <th>Nazwa</th>
            <th>Lokalizacja</th>
        </tr>
        <tr v-for="location in locations">
            <td><name :entity="location"></name></td>
            <td>
                <location v-bind:id="location" display-map="true"></location>
            </td>
        </tr>
    </table>
</div>
    `
});