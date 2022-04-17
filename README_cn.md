# XGantt (vue2版本)

![](./src/assets/logo.png)

![](https://img.shields.io/npm/v/@xpyjs/gantt-vue2.svg) ![](https://img.shields.io/npm/l/@xpyjs/gantt-vue2.svg)

[[English](./README.md)] [[中文](./README_cn.md)]

基于 vue2 的高性能甘特组件。

## 十分重要

这个库是 `jz-gantt` 的 vue2 版本的继承库。

### 如何更新

1. 包名不同， `@xpyjs/gantt-vue2` 替换了 `jz-gantt`。
2. 所有以 `j-` 或 `J` 的前缀全都更新为 `x-` 或 `X`。

除此之外，无需其他改动。

## 截图

![截图](./src/assets/Snipaste.png)

## 什么是 XGantt

- [x] 自定义表格内容
- [x] 自定义甘特内容
- [x] 自定义表头
- [x] 动态渲染数据
- [x] 自定义样式

## 如何使用

### 安装

```bash
npm install @xpyjs/gantt-vue2 --save
```

### 使用

```js
import Vue from "vue";
import XGantt from "@xpyjs/gantt-vue2";
import "@xpyjs/gantt-vue2/lib/gantt-vue2.css";

Vue.use(XGantt);
```

## 文档

查看源码 [Github](http://github.com/xpyjs/gantt-vue2)

查看文档 [document web](https://docs.xiaopangying.com/gantt/docs/vue2)

### 基础用法

数据应当是一个数组。其中， `index`, `startDate`, `endDate` 和 `children` 是必须的选项，它们会帮助甘特图正确渲染。

```js
const dataList = [
    {
        index: 1,
        startDate: "2020-06-05",
        endDate: "2020-08-20",
        ttt: {
            a: "aaa",
            b: "bbb"
        },
        name: "mydata1",
        children: []
    },
    {
        index: 2,
        startDate: "2020-07-07",
        endDate: "2020-09-11",
        ttt: {},
        name: "mydata2",
        children: [
            {
                index: 3,
                startDate: "2020-07-10",
                endDate: "2020-08-15",
                ttt: {
                    a: "aaa"
                },
                name: "child1",
                children: []
            }
        ]
    }
];
```

```html
<x-gantt
    data-index="index"
    :data="dataList"
/>
```

### 使用列组件

内置了一个列组件，名为 `XGanttColumn`。其中， `label` 属性是必须的。

```html
<x-gantt
    data-index="index"
    :data="dataList"
>
    <x-gantt-column label="index" />
</x-gantt>
```

### 使用甘特组件

内置了一个甘特组件，名为 `XGanttSlider`。

> 需要注意，只有一个甘特组件会被渲染，如果传入多个，则只有最后一个组件会被渲染。

```html
<x-gantt
    data-index="index"
    :data="dataList"
>
    <x-gantt-slider />  <!-- no render -->
    <x-gantt-slider />  <!-- will be rendered -->
</x-gantt>
```

## License

MIT
