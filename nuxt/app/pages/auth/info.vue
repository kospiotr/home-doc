<script setup lang="ts">
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()

definePageMeta({
  layout: 'plain'
})
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user }}!</h1>
    <pre>{{JSON.stringify(user, null, 2)}}</pre>
    <p>Logged in since {{ session?.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/auth/github">Login with GitHub</a>
    <!-- or open the OAuth route in a popup -->
    <button @click="openInPopup('/auth/github')">Login with GitHub</button>
  </div>
</template>
