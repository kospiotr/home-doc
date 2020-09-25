Vue.component('location', {
    props: ['id'],
    data: function(){
        return {displayMap: false}
    },
    computed: {
        place: function(){
            return this.location && this.$store.getters.placeById(this.location.place);
        },
        location: function(){
            return this.$store.getters.locationById(this.id);
        },
        points: function(){
            if(this.location && this.location.coordinates){
                return this.location.coordinates.map(v => {
                    return Object.assign({color: 'red'}, v)
                })
            }
            return []
        },
        map: function(){
            return this.place && this.place.map;
        }
    },
    methods: {
        toggleMap: function(){
            this.displayMap = !this.displayMap;
        }
    },
    template: `
    <div :title="location.id" v-if="location" @mouseover="displayMap=true" @mouseout="displayMap=false">
        <event-map
            v-if="map"
            :map="map" :points="points"
            ></event-map>
        <div>ID: {{location.id}}</div>
        <div v-if="place">Piętro: {{place.level}}, Pomieszczenie: {{place.label}}</div>
        <div v-if="location">Miejsce: {{location.label}}</div>
    </div>
    `
});