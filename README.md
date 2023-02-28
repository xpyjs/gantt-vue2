# XGantt For vue2

![](./src/assets/logo.png)

![](https://img.shields.io/npm/v/@xpyjs/gantt-vue2.svg) ![](https://img.shields.io/npm/l/@xpyjs/gantt-vue2.svg)

[[English](./README.md)] [[中文](./README_cn.md)]

A high-performance vue2 gantt component.

#### `vue3` version is [here](https://github.com/xpyjs/gantt)

## Use vue2 problem. Please read before use, very important

********************************

`vue2.6.x` and `vue2.7.x` are incompatible.

- #### If you use `vue2.6.14`

Due to the npm upgrade mechanism, please change the dependent version to fixed:

```json
"vue": "2.6.14",
"vue-template-compiler": "2.6.14"
```

And then, install `@xpyjs/gantt-vue2@1` version 1.x for this.

The above can solve the initialization error problem, see details [ISSUE](https://github.com/xpyjs/gantt-vue2/issues/5)

- #### If you use `vue2.7.x`

Please install `@xpyjs/gantt-vue2@2` version 2.x for this. Default install will be v2.

********************************

## Important

This repo is previous `jz-gantt`. Only vue2 version. If you have used `jz-gantt` before, you should read the following carefully.

**Specification:**

> - 'jz-gantt' vue2 version (v0.0.17) is deprecated.
> - This project is completely rewritten. Based on the 'vue3' code, support content to '1.3.1', but no updates, just basic maintenance. If you need to update the content, please use the `vue3` version, or update yourself.
> - Also, if you fork and PR, I will check and merge it into the main branch and update the version content.

### How to migrate

1. package name changed. `@xpyjs/gantt-vue2` replaced `jz-gantt`.
2. All `j-` or `J` prefix updpate to `x-` or `X`.

Beyond that, no other action is required.

## Snipaste

![Snipaste](./src/assets/Snipaste.png)

## What is XGantt

- [x] Custom table column content
- [x] Custom gantt row content
- [x] Custom header content
- [x] Dynamic update data
- [x] Custom any style

## How to use

### install

```bash
npm install @xpyjs/gantt-vue2 --save

// or
yarn add @xpyjs/gantt-vue2
```

### use

```js
import Vue from "vue";
import XGantt from "@xpyjs/gantt-vue2";
import '@xpyjs/gantt-vue2/lib/index.css';

Vue.use(XGantt);
```

## Document

For resource code, see [Github](http://github.com/xpyjs/gantt-vue2)

For more detailed documentation, see [document web](https://docs.xiaopangying.com/gantt/docs/vue2)

### Basic use

Data should be Array type, `index`, `startDate`, `endDate` and `children` are supposed in data item, they help to display the data correctly.

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

### Use table column

We provide a slot named `XGanttColumn`. `label` is required, and it should match data key. `label`'s value should correspond to the name of the field in 'data' (deep query support), which tells the component to render the column.

```html
<x-gantt
    data-index="index"
    :data="dataList"
>
    <x-gantt-column label="index" />
</x-gantt>
```

### Use gantt slider

We provide a slot named `XGanttSlider`.

Only one slider whill be rendered. If you insert more than one slider, only last slider will be display.

```html
<x-gantt
    data-index="index"
    :data="dataList"
>
    <x-gantt-slider />  <!-- no render -->
    <x-gantt-slider />  <!-- will be rendered -->
</x-gantt>
```

## Differences with vue3 version

- Date is not highlighted when hovering `slider`
- Dragging progress value on `slider` is not allowed

## License

MIT
