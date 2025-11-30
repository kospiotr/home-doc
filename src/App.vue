<template>
  <router-view />
</template>

<script setup lang="ts">
import {useDataStore} from "stores/data";
import {onMounted} from "vue";


onMounted(async () => {
  await useDataStore().load()
})
//
</script>
