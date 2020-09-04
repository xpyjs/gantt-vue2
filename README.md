# JzGantt

version: 1.0

A simple gantt component by vue.
![vue 2.x](https://img.shields.io/badge/vue-2.x-43B984) ![animate.css](https://img.shields.io/badge/animate.css-4.x-9E84E2)

## Snipaste

![Snipaste](./src/assets/Snipaste.png)

## What is JzGantt

- [x] Custom table column content
- [x] Custom gantt row content
- [x] Custom header content
- [x] Dynamic update data
- [x] Custom any style

## How to use

### install

```bash
npm install jz-gantt --save
```

### use

```js
import Vue from "vue";
import Gantt from "jz-gantt";
import "jz-gantt/lib/jz-gantt.css";

Vue.use(Gantt);
```

## Document

For resource code, see [Github](http://github.com/jeremyjone/jz-gantt)

For more detailed documentation, see [document web](https://jeremyjone.github.io/docs/document/gantt/)

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
<j-gantt
    data-index="index"
    :data="dataList"
/>
```

### Use table column

We provide a slot named `JGanttColumn`. `Label` is required, and it should match data key.

```html
<j-gantt
    data-index="index"
    :data="dataList"
>
    <j-gantt-column label="index" />
</j-gantt>
```

### Use gantt slider

We provide a slot named `JGanttSlider`.

Only one slider whill be rendered. If you insert more than one slider, only last slider will be display.

```html
<j-gantt
    data-index="index"
    :data="dataList"
>
    <j-gantt-slider />  <!-- no render -->
    <j-gantt-slider />  <!-- will be rendered -->
</j-gantt>
```

## License

MIT
