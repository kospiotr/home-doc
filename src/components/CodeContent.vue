<script setup lang="ts">

import {copyToClipboard, Notify} from "quasar";

const {content} = defineProps<{ content: string }>()

const copy = () => {
  console.log("Copying content to clipboard")
  copyToClipboard(content)
  .then(() => {
    Notify.create('Content copied to clipboard')
    console.info("Copy content to clipboard")
  })
  .catch((e) => {
    console.error("Failed to copy content to clipboard", e)
  })}
</script>

<template>
  <q-btn flat dense class="fixed-top-right" icon="content_copy" @click="copy"/>
  <pre><code>{{ content }}</code></pre>
</template>

<style scoped>

</style>
