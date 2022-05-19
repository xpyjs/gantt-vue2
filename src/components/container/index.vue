<template>
  <div style="width: 100%; height: 100%">
    <!-- 左侧表格 -->
    <sync-scroll-container
      vertical
      style="width: 50px; height: 250px; display: inline-block"
      hide-scroll
      disable-horizontal
      :group="id"
    >
      <div
        style="
          width: 50px;
          height: 50px;
          background: linear-gradient(0.25turn, blue, yellow, red);
          position: sticky;
          top: 0;
        "
      ></div>
      <div style="width: 50px; background: linear-gradient(blue, yellow, red)">
        <div v-for="i in 50" :key="i" style="height: 20px">{{ i }}</div>
      </div>
      <div style="height: 17px"></div>
    </sync-scroll-container>

    <div style="display: inline-block">
      <!-- 甘特头 -->
      <sync-scroll-container
        horizontal
        hide-scroll
        :group="id"
        style="height: 50px; width: 500px"
      >
        <div
          style="
            height: 50px;
            width: 600px;
            background: linear-gradient(0.25turn, red, green, blue);
            padding-right: 17px;
          "
        >
          <div
            v-for="i in 30"
            :key="i"
            style="width: 20px; display: inline-block"
          >
            {{ i }}
          </div>
        </div>
      </sync-scroll-container>

      <!-- 甘特内容 -->
      <sync-scroll-container
        vertical
        horizontal
        :group="id"
        style="width: 500px; height: 200px"
      >
        <div style="width: 600px; background: green">
          <div
            v-for="i in 50"
            :key="i"
            style="height: 20px; text-align: center"
          >
            {{ i }}
          </div>
        </div>
      </sync-scroll-container>
    </div>
  </div>
</template>

<script>
import { uuid } from '@/utils';
import SyncScrollContainer from './SyncScrollContainer.vue';

export default {
  name: 'XContainer',

  components: { SyncScrollContainer },

  data() {
    return {
      id: uuid(12) // 组件唯一标识，页面多个组件时需要 id 区分
    };
  }
};
</script>

<style scoped></style>
