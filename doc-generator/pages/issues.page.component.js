Vue.component('validation-page', {
    computed:{
        uniqueIdsCheck: function(){
            var aggregate = this.$store.getters.entities
                .reduce((acc, entity) => {
                    const entityId = entity.id;
                    acc[entityId] = (acc[entityId] || 0) + 1;
                    return acc
                },{})
            var result = Object.entries(aggregate)
                .filter(entry => entry[1] > 1)
            return {
                issue: result.length == 0,
                result: result,
                summary: 'Checking unique IDs across entities'
            }
        },
        noLocationDefined: function(){
            var result = this.$store.getters.entities
                .filter(entity => !entity.location)
                .map(entity => entity.id)
            return {
                issue: result.length == 0,
                result: result,
                summary: 'No Location defined'
            }
        },
        incorrectLocation: function(){
            var result = this.$store.getters.entities
                .filter(entity => !entity.$location)
                .map(entity => entity.id)
            return {
                issue: result.length == 0,
                result: result,
                summary: 'Incorrect location'
            }
        },
        coordinatesMissing: function(){
            var result = this.$store.getters.locations
                .filter(location => !location.coordinates)
                .map(location => location.id)
            return {
                issue: result.length == 0,
                result: result,
                summary: 'Misssing coordinates in location'
            }
        },
        slotsExceeded: function(){
            var result = this.$store.getters.entities
                .filter(entity => entity.slot && entity.$location && entity.$location.slots && entity.slot > entity.$location.slots)
                .map(entity => entity.id)
            return {
                issue: result.length == 0,
                result: result,
                summary: 'Slots exceeded'
            }
        },
        missingDefinedOutputs: function(){
            const entityIds = this.$store.getters.entities.map(entity => entity.id);
            const result = this.$store.getters.entities
                .flatMap(entity => Object.values((entity.actions || [])))
                .flatMap(entity => Object.values((entity)))
                .flatMap(entity => Object.values((entity)))
                .filter(target => entityIds.indexOf(target) == -1)

            return {
                issue: result.length == 0,
                result: result,
                summary: 'Missing defined action targets'
            }
        },
        checks: function(){
            return [this.uniqueIdsCheck, this.noLocationDefined, this.incorrectLocation, this.coordinatesMissing, this.slotsExceeded, this.missingDefinedOutputs]
        }
    },
    template: `
    <div>
        <h1>Walidacja</h1>
        <table>
            <tr>
                <th>Opis</th>
                <th>Rezultat</th>
                <th>Szczegóły</th>
            </tr>
            <tr v-for="check in checks">
                <td>{{check.summary}}</td>
                <td v-bind:style="{backgroundColor: check.issue ? 'lightgreen' : 'red'}">{{check.issue ? 'OK' : 'BLAD'}}</td>
                <td>{{check.result}}</td>
            </tr>
        </table>
</div>
    `
});