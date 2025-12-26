<script setup lang="ts">

definePageMeta({
  layout: 'plain'
})

</script>

<template>
  <div class="flex flex-row min-h-screen justify-center items-center">
    <UButton label="Login using Github" @click="navigateTo('/api/auth/github', { external: true})"/>
  </div>
</template>
