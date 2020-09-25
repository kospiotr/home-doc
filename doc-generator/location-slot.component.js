Vue.component('location-slot', {
    props: ['index', 'location'],
    computed:{
        locationRef: function(){
            return this.location && this.$store.getters.locationById(this.location);
        },
        slots: function(){
            return this.locationRef && this.locationRef.slots;
        },
        maxSlots: function(){
            return Math.max(this.slots || 0, this.index || 0);
        }
    },
    methods:{
        style: function(i){
            const out = {};
            out['background-color'] = i <= this.slots ?  'lightgreen' : 'red'
            out['font-weight'] = i == this.index ? 'bold' : null
            out['box-shadow'] = i == this.index ? 'inset 0px 0px 4px 3px black' : null
            return out;
        }
    },
    template: `
    <div v-if="index">
        Slot: {{index}} / {{slots}}
        <table v-if="index">
            <tr>
                <td v-for="i of maxSlots" style="text-align: center;" v-bind:style="style(i)">
                {{i}}
                </td>
            </tr>
        </table>
    </div>
    `
});