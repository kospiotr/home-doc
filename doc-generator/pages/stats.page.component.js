Vue.component('stats-page', {
    computed: {
        entities: function(){return this.$store.getters.entities;}
    },
    template: `
    <div>
        <h1>Statystyki</h1>
        <h2>Pomieszczenie / Typy</h2>
        <place-with-type-stats :entities="entities"></place-with-type-stats>
        <h2>Pomieszczenie / Kierunek</h2>
        <place-with-direction-stats :entities="entities"></place-with-direction-stats>
</div>
    `
});
