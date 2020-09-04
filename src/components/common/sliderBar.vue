<template>
  <div class="gt-slider-bar">
    <input type="range" :min="min" :max="max" v-model="val" />
    <div class="show-val gt-shadow">{{ val }}</div>
  </div>
</template>

<script>
export default {
  name: "GtSliderBar",

  props: {
    value: Number,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      defalut: 100
    }
  },

  beforeCreate() {},

  created() {
    this.val = this.value;
  },

  beforeMount() {},

  mounted() {},

  beforeDestroy() {},

  destroyed() {},

  data() {
    return {
      val: 0
    };
  },

  computed: {},

  watch: {
    val: function(nv) {
      this.$emit("change", nv);
    },

    value: function(nv) {
      this.val = nv;
    }
  },

  methods: {},

  components: {}
};
</script>

<style lang="stylus" scoped>
.gt-slider-bar
  display flex
  flex-shrink 0

  .show-val
    height 16px
    width 16px
    font-size 12px
    display flex
    align-items center
    justify-content center
    margin auto 0 auto 5px
    background-color #fff
    border 1px solid rgba(200, 200, 200, 0.8)
    border-radius 5px
</style>
