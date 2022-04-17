# XGantt For vue2

version: 1.0

A high-performance vue2 gantt component.
![vue 2.x](https://img.shields.io/badge/vue-2.x-43B984) ![animate.css](https://img.shields.io/badge/animate.css-4.x-9E84E2)

## Important

This repo is previous `jz-gantt`. Only vue2 version.

### How to update

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
```

### use

```js
import Vue from "vue";
import XGantt from "@xpyjs/gantt-vue2";
import "@xpyjs/gantt-vue2/lib/gantt-vue2.css";

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

We provide a slot named `XGanttColumn`. `Label` is required, and it should match data key.

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

## License

MIT
