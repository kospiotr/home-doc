Vue.component('place-with-direction-stats', {
    props: ['entities'],
    computed:{
        stats: function(){
            return (this.entities || [])
                .reduce((acc, entity)=>{
                    const place = entity.$place && entity.$place.label;
                    const directionId = entity.$type && entity.$type.direction;
                    const direction = directionId && this.$store.getters.directionById(directionId);
                    const type = (direction && direction.label) || undefined;
                    if(!acc[place]){
                        acc[place] = {};
                    }
                    if(!acc[place][type]){
                        acc[place][type] = [];
                    }
                    acc[place][type].push(entity);
                    return acc
                },{})
        },
        data: function(){
            return this.grid(this.stats)
        }
    },
    methods:{
        grid: function(data){
            const value = function(data){
                return data && data.length || 0;
            }
            const cols = Object.values(data || {})
                .flatMap(type => Object.keys(type))
                .filter( (value, index, self) => self.indexOf(value) === index)
                .map((col, index) => {
                    return {
                        label: col,
                        sum: function(){
                            return rows.map(row => row.cells)
                                .map(cols => cols[index])
                                .map(cell => cell.value)
                                .reduce((acc,value)=>{acc+=value;return acc;},0)
                        }
                    }
                })
            const rows = Object.entries(data || {})
                .map((entry,rowIndex) => {
                    const row = entry[1];
                    const cells = cols
                        .map((col,colIndex) => {
                            return {
                                colIndex: colIndex,
                                rowIndex: rowIndex,
                                value: value(row[col.label]),
                                data: row[col]
                            }
                        })

                    return {
                        cells: cells,
                        label: entry[0],
                        sum: function(){
                            return cells.reduce((acc,cell) => {acc+=cell.value; return acc},0);
                        }
                    }
                })
            return {cols, rows, sum: function(){return rows.map(row => row.sum()).reduce((acc,value)=>{acc+=value;return acc;},0)}}

        }
    },
    template: `
    <div>
        <table>
            <tr>
                <th>Pomieszczenie</th>
                <th v-for="col in data.cols">{{col.label}}</th>
                <th>Suma</th>
            </tr>
            <tr v-for="row in data.rows">
                <td>{{row.label}}</td>
                <td v-for="cell in row.cells">{{cell.value}}</td>
                <th>{{row.sum()}}</th>
                </td>
            </tr>
            <tr>
                <th>Suma</th>
                <th v-for="col in data.cols">{{col.sum()}}</th>
                <th>{{data.sum()}}</th>
            </tr>
        </table>
</div>
    `
});
