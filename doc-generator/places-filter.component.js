Vue.component('places-filter', {
    computed:{
        places: function(){
            return this.$store.getters.places
        },
        value: {
            get () {
              return this.$store.state.filters.places
            },
            set (value) {
              this.$store.commit('updateFilterPlaces', value)
            }
        }
    },
    methods:{
      onAll: function(){
        this.value = this.places.map(place => place.id)
      },
      onNone: function(){
        this.value = [];
      }
    },
    template: `
        <div class="filter">
            <div>Miejsce</div>
            <div>
                <span v-for="place in places">
                    <input type="checkbox" v-model="value" v-bind:value="place.id"/>
                    {{place.label}}
                </span>
            </div>
            <div>
                <button @click="onAll">All</button>
                <button @click="onNone">None</button>
            </div>
        </div>
    `
})