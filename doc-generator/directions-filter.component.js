Vue.component('directions-filter', {
    computed:{
        directions: function(){
            return this.$store.getters.directions
        },
        value: {
            get () {
              return this.$store.state.filters.directions
            },
            set (value) {
              this.$store.commit('updateFilterDirections', value)
            }
        }
    },
    methods:{
      onAll: function(){
        this.value = this.directions.map(place => place.id)
      },
      onNone: function(){
        this.value = [];
      }
    },
    template: `
        <div class="filter">
            <div>Kierunek</div>
            <div>
                <span v-for="direction in directions">
                    <input type="checkbox" v-model="value" v-bind:value="direction.id"/>
                    {{direction.label}}
                </span>
            </div>
            <div>
                <button @click="onAll">All</button>
                <button @click="onNone">None</button>
            </div>
        </div>
    `
})