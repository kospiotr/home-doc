Vue.component('event-map', {
    props: {
        map: String,
        points: Array,
        width: {type: Number, default: 300},
        height: {type: Number, default: 300},
        borders: {type: Number, default: 50}
    },
    computed:{
        viewBox: function(){
            var borders = this.borders;
            var minX = this.points.map(item => item.x).reduce((prev,cur) => {return prev <= cur ? prev : cur},10000)
            var minY = this.points.map(item => item.y).reduce((prev,cur) => {return prev <= cur ? prev : cur},10000)
            var maxX = this.points.map(item => item.x).reduce((prev,cur) => {return prev >= cur ? prev : cur},-10000)
            var maxY = this.points.map(item => item.y).reduce((prev,cur) => {return prev >= cur ? prev : cur},-10000)
            var xRadius = (maxX - minX) / 2;
            var yRadius = (maxY - minY) / 2;
            var xCenter = minX + xRadius;
            var yCenter = minY + yRadius;
            xRadius = xRadius < this.width / 2 ? this.width / 4 : xRadius;
            yRadius = yRadius < this.height / 2 ? this.height / 4 : yRadius;
            var x = xCenter - xRadius - borders;
            var y = yCenter - yRadius - borders;
            var width = xRadius*2 + 2*borders;
            var height = yRadius*2 + 2*borders;
            var out = x + " " + y + " " + width + " " + height;
//            console.log('=====');
//            console.log({out})
//            console.log({widthImg: this.width, minX, maxX, xCenter, xRadius, x, width})
//            console.log({heightImg: this.height, minX, maxX, xCenter, yRadius, x, height})
//            console.log('=====');
            return out;
        }
    },
    template: `<div v-if="map">
    <!--{{viewBox}}-->
    <svg :width="width" :height="height" :viewBox="viewBox">
        <image :href="map" x="0" y="0" />
        <circle v-for="point in points" :cx="point.x" :cy="point.y" r="5" :stroke="point.color" fill="transparent" stroke-width="5"/>
    </svg></div>`
});