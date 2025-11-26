<template>
  <q-page class="q-pa-md">
    <h4>Example Page</h4>
    <p>This is a new example page. Replace this content with your real page content.</p>
    <q-btn label="Go Home" to="/"/>
    <q-btn @click="test" label="Test"/>
  </q-page>
</template>

<script setup lang="ts">
import {useDataStore} from "stores/backend";
import {useMeta} from "quasar";

useMeta({title: 'Settings'})
const dataStore = useDataStore()

const test = async () => {
  const data = await dataStore.load()
  console.log("Data loaded", data)

}
</script>

<style scoped>
/* ...existing code... */
</style>

