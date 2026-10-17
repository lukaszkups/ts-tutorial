<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme

function goHome(event) {
  event.preventDefault()
  window.location.assign('/')
}
</script>

<template>
  <Layout>
    <template #layout-top>
      <a
        class="lk-back-home"
        href="/"
        title="Back to lukaszkups.net"
        aria-label="Back to lukaszkups.net"
        @click="goHome"
      >
        <span class="lk-back-home__mark">
          <span class="lk-back-home__logo" aria-hidden="true"></span>
        </span>
      </a>
    </template>
  </Layout>
</template>
