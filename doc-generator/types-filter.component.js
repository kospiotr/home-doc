Vue.component('types-filter', {
    computed:{
        types: function(){
            return this.$store.getters.types
        },
        value: {
            get () {
              return this.$store.state.filters.types
            },
            set (value) {
              this.$store.commit('updateFilterTypes', value)
            }
        }
    },
    methods:{
      onAll: function(){
        this.value = this.types.map(type => type.id)
      },
      onNone: function(){
        this.value = [];
      }
    },
    template: `
        <div class="filter">
            <div>Typ</div>
            <div>
                <span v-for="type in types">
                    <input type="checkbox" v-model="value" v-bind:value="type.id"/>
                    {{type.label}}
                </span>
            </div>
            <div>
                <button @click="onAll">All</button>
                <button @click="onNone">None</button>
            </div>
        </div>
    `
})