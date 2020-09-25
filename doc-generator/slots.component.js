Vue.component('slots', {
    props: ['index', 'slots'],
    computed:{
        maxSlots: function(){
            return Math.max(this.slots || 0, this.index || 0);
        },
        rows: function(){
            const slots = this.slots
            return slots < 32 ? 1 : slots < 64 ? 2 : 4;
        },
        itemsInRow: function(){
            return this.slots / this.rows
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
    <div>
        <div class="slot">
            <div v-for="row of rows" style="border: 1px solid black" class="row">
                <div v-for="i of maxSlots" v-if="i <= row * itemsInRow && i > (row-1)*itemsInRow" v-bind:style="style(i)" class="cell">{{i-1}}</div>
            </div>
        </div>
    </div>
    `
});
