<template>
  <div class="gt-line gt-shadow" :style="{ 'background-color': color }"></div>
</template>

<script>
export default {
  name: "GtLine",

  props: {
    color: {
      type: String,
      default: "lightgrey"
    }
  }
};
</script>

<style lang="stylus" scoped>
.gt-line
    width 100%
    height 1px
    margin 10px 0
</style>
