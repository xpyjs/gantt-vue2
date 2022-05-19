<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Container msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Container from './components/container/index.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Container
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
