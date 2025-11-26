<template>
  <div class="doc-copy-btn">
    <q-icon name="content_paste" color="brand-primary" @click="copy" />

    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-badge
        class="absolute header-badge"
        v-show="copied"
        label="Copied to clipboard"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from 'quasar'

const props = defineProps< {text: string} >()


const copied = ref(false)

function copy () {

  copyToClipboard(props.text)
    .then(() => {
      copied.value = true
    })
    .catch(() => {})
}
</script>

<style lang="sass">
.doc-copy-btn
  position: absolute
  top: 8px
  right: 16px // account for scrollbar

  .q-icon
    cursor: pointer
    font-size: 20px
    padding: 4px
    opacity: 0
    transition: opacity .28s

  .q-badge
    top: 4px
    right: 34px

body.body--light
  .doc-copy-btn .q-icon
    &:hover
      background-color: #fff

body.body--dark
  .doc-copy-btn .q-icon
    &:hover
      background-color: #000

.copybtn-hover:hover
  .doc-copy-btn .q-icon
    opacity: 1
</style>
