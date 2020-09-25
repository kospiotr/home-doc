Vue.component('entities-page', {
    computed:{
        entities: function(){
            const filters = this.$store.state.filters
            console.log({filters})
            return this.$store.getters.entities
                .filter(entity => filters.places.indexOf(entity.$place && entity.$place.id) > -1)
                .filter(entity => filters.directions.indexOf(entity.$direction && entity.$direction.id) > -1)
                .filter(entity => filters.types.indexOf(entity.$type && entity.$type.id) > -1)

        },
        stats: function(){
            return []
//            return this.entities
//                .reduce((acc, inputLocation) => {
//                    acc[inputLocation.place] = (acc[inputLocation.place] || 0)+1;
//                    return acc;
//                },{})
        },
        visible: function(){
            return this.entities.length
        },
        total: function(){
            return this.$store.getters.entities.length
        },
        filters: function(){
            return this.$store.state.filters;
        }
    },
    template: `
    <div>
        <h1>Encje</h1>
        <div>
            <h2>Filtry</h2>
                <places-filter></places-filter>
            <div style="display:flex">
                <directions-filter></directions-filter>
                <types-filter></types-filter>
            </div>
        </div>
        <div>
            <h2>Statystyki</h2>
            <div>
                <span v-for="(statValue, statKey) in stats" style="padding-right: 10px;">{{statKey}}: {{statValue}}</span>
                <span>Encji: {{visible}} / {{total}}</span>
            </div>
        </div>
        <div>
            <h2>Zestawienie</h2>
            <table>
                <tr>
                    <th>Nazwa</th>
                    <th>Lokalizacja</th>
                    <th>Akcje</th>
                </tr>
                <tr v-for="entity in entities">
                    <td><entity :entity="entity"></entity></td>
                    <td>
                        <location v-bind:id="entity.location"></location>
                        <location-slot :index="entity.slot" :location="entity.location"></location-slot>
                    </td>
                    <td>
                        <action :entity-id="entity.id"></action>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    `
});