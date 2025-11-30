<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="bg-white text-grey-8 q-py-xs shadow-1" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          @click="uiStore.mainLeftDrawerOpen = !uiStore.mainLeftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />


        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="video_call" v-if="$q.screen.gt.sm">
            <q-tooltip>Create a video or post</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="apps" v-if="$q.screen.gt.sm">
            <q-tooltip>Apps</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="message" v-if="$q.screen.gt.sm">
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              2
            </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="uiStore.mainLeftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(links, index) in entries" :key="index">

          <q-item v-for="link in links" :key="link.text" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="grey" :name="link.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <router-link :to="link.route ?? '/'">
                {{ link.text }}
                </router-link>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md"/>

          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {useUiStore} from "stores/ui";
const uiStore = useUiStore()

const entries = [
  [
    {icon: 'home', text: 'Home', route: '/'},
  ],
  [
    {icon: 'folder', text: 'Devices', route: '/devices'},
    {icon: 'map', text: 'Topology', route: '/topology'},
    {icon: 'map', text: 'Areas', route: '/topology'},
    {icon: 'map', text: 'Locations', route: '/topology'},
    {icon: 'map', text: 'Inputs', route: '/inputs'},
    {icon: 'map', text: 'Outputs', route: '/outputs'},
    {icon: 'map', text: 'Actions', route: '/actions'},
    {icon: 'watch_later', text: 'Stats', route: '/stats'},
    {icon: 'thumb_up_alt', text: 'Validation', route: '/validation'}
  ],
  [
    {icon: 'settings', text: 'Settings', route: '/settings'},
  ]
]
</script>

<style lang="sass">
.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0, 0, 0, .24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000

a
  text-decoration: none
  color: inherit
</style>
