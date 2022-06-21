import Vue from 'vue';

declare class XComponent extends Vue {
  static install(vue: typeof Vue): void;
}
