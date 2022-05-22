// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface VueConstructor {
    install: (Vue: VueConstructor) => void;
  }
}
