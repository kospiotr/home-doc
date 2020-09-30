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
        allControllableEntitiesAreConnectedToControllers: function(){
            const connectedEntities = this.$store.getters.controllers
                .flatMap(controller => controller.entities)
                .map(entity => entity.id)
            const result = this.$store.getters.entities
                .filter(entity => entity.controllable)
                .map(entity => entity.id)
                .filter(entityId => connectedEntities.indexOf(entityId) == -1)

            return {
                issue: result.length == 0,
                result: result,
                summary: 'All Controllable Entities are connected to Controllers'
            }
        },
        somePlacesAreNotControlled: function(){
            const controlledPlaces = this.$store.getters.controllers
                .flatMap(controller => controller.controlling)
            console.log(controlledPlaces);
            const result = (this.$store.getters.places || [])
                .map(place => place.id)
                .filter(place => place)
                .filter(placeId => controlledPlaces.indexOf(placeId) == -1)

            return {
                issue: result.length == 0,
                result: result,
                summary: 'Some places are not controlled'
            }
        },
        someEntitiesAreConnectedToMultipleControllers: function(){
            const entitiesWithControllers = (this.$store.getters.controllers || [])
                .flatMap(controller => controller.entities.map(entity => {
                    return {entityId: entity.id, controllerId: controller.id}
                }))
                .reduce((acc, value) => {
                    if(!acc[value.entityId]){
                        acc[value.entityId] = [];
                    }
                    acc[value.entityId].push(value.controllerId);
                    return acc;
                },{})
            const result = Object.entries(entitiesWithControllers)
                .filter(entry => entry[1].length > 1)

            return {
                issue: result.length == 0,
                result: result,
                summary: 'Some entities are connected to multiple controllers'
            }
        },
        controllersHavingMoreThan32Inputs: function(){
            const result = (this.$store.getters.controllers || [])
                .flatMap(controller => controller.entities.map(entity => {
                    return {direction: entity.$type.direction, controllerId: controller.label}
                }))
                .filter(entry => entry.direction == 'input')
                .reduce((acc, value) => {
                    if(!acc[value.controllerId]){
                        acc[value.controllerId] = 0;
                    }
                    acc[value.controllerId]++;
                    return acc;
                },{})
            return {
                issue: Object.values(result).filter(controllersWithInputs => controllersWithInputs > 32).length == 0,
                result: result,
                summary: 'Controllers having more than 32 inputs'
            }
        },
        relatedEntitiesAreNotControlledByTheSameController: function(){
            const result = [];

            return {
                issue: result.length == 0,
                result: result,
                summary: 'Related entities are not controlled by the same controller'
            }
        },
        checks: function(){
            return [this.uniqueIdsCheck, this.noLocationDefined, this.incorrectLocation, this.coordinatesMissing, this.slotsExceeded, this.missingDefinedOutputs, this.allControllableEntitiesAreConnectedToControllers, this.someEntitiesAreConnectedToMultipleControllers, this.somePlacesAreNotControlled, this.controllersHavingMoreThan32Inputs, this.relatedEntitiesAreNotControlledByTheSameController]
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