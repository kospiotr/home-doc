Vue.component('entity-map', {
    props: ['ids','width','height','borders'],
    data: function(){
        return {
            colors: ['red', 'blue', 'yellow', 'cyan']
        }
    },
    computed: {
        entitiesWithColor: function(){
            return this.ids
                .flatMap((ids,idsIndex) => {
                    if(ids){
                        return ids.flatMap((id, idIndex) => {
                            const entity = this.$store.getters.entityById(id.id);
                            return {
                                entity,
                                color: id.color || this.colors[idsIndex]
                            }
                        })

                    } else{
                       return [];
                    }
                });

        },
        locationsWithColor: function(){
            return this.entitiesWithColor
                .map(entityWithColor => {
                    const entity = entityWithColor.entity;
                    const locationId = entity && entity.location;
                    const location = locationId && this.$store.getters.locationById(locationId);
                    const place = location && location.place && this.$store.getters.placeById(location.place);
                    const map = place && place.map;
                    const coordinates = (location && location.coordinates) || [];

                    return {
                        locationId, map, coordinates, color: entityWithColor.color
                    }
                })
        },
        maps: function(){
            return this.locationsWithColor.reduce((acc, item)=>{
                const map = item && item.map;
                if(!map){
                    return acc;
                }
                if(!acc[map]){
                    acc[map] = {
                        map: map,
                        points: []
                    }
                }

                const points = item.coordinates.map(coordinate => {
                    return {
                        x: coordinate.x,
                        y: coordinate.y,
                        color: item.color
                    }
                })
                acc[item.map].points = acc[item.map].points.concat(points)

                return acc;
            },{});
        }
    },
    template: `
    <div>
        <event-map
            v-for="map in maps"
            :map="map.map"
            :width="width"
            :height="height"
            :borders="borders"
            :points="map.points"
        ></event-map>
    </div>`
})
//        MAPS: {{maps}}
//        MAPS: {{maps}}
//        ENTITIES: {{entities}}
//        LOCATIONS: {{locationsWithColor}}
