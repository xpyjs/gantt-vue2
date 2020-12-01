<template>
  <div id="app">
    <JGantt
      ref="gantt"
      header-height="60"
      row-height="30"
      data-index="index"
      expand-all
      :dark="isDark"
      :show-checkbox="showCheckbox"
      :show-weekend="showWeekend"
      :show-today="showToday"
      :show-expand="showExpand"
      :data="dataList"
      :header-style="headerStyle"
      :body-style="bodyStyle"
      :level-color="levelColor"
      @row-click="rowClick"
      @row-dbl-click="rowDblClick"
      @row-checked="rowChecked"
      @move-slider="moveSlider"
      @no-today-error="noTodayError"
    >
      <JGanttSlider
        flat
        label="startDate"
        date-format="MM-dd H:mm:s"
        empty-data=""
        bg-color="orange"
        :move="true"
        :resize-left="true"
        :resize-right="true"
        :linked-resize="true"
      >
        <template v-slot:content="data">
          <div
            style="background-color: #123456;display: flex;justify-content: center;height:5px"
          >
            {{ data.name }} - {{ data.index }}
          </div>
        </template>
        <template v-slot:left>
          <div style="background-color:#123456;width:5px;height:10px" />
        </template>
        <template v-slot:right>
          <div style="background-color:#123456;width:5px;height:10px" />
        </template>
      </JGanttSlider>

      <JGanttColumn label="index" :merge="merge3">
        <template v-slot="data">
          <div style="background-color: #CCC; width: 100%">{{ data.name }}</div>
        </template>
      </JGanttColumn>

      <JGanttColumn label="name" width="150" :merge="merge3">
        <template v-slot="data">
          <div>2 - {{ data }}</div>
        </template>
      </JGanttColumn>

      <JGanttColumn label="aaa" date-format :merge="merge5">
        <template>
          <div v-for="i in 100" :key="i">{{ i }}</div>
        </template>
      </JGanttColumn>

      <JGanttColumn
        label="startDate"
        width="180"
        center
        date-format
        :merge="merge4"
      >
      </JGanttColumn>

      <JGanttColumn
        label="endDate"
        name="自定义标签"
        width="200"
        date-format="q yyyy-MM-dd HH:mm:ss"
        :merge="merge4"
      >
        <template v-slot="data">
          <span name="end" :style="{ 'background-color': `#${555}` }">
            abc - {{ data.endDate }}
          </span>
        </template>
      </JGanttColumn>

      <JGanttColumn label="picture12345" :merge="merge5">
        <template v-slot="data"> 👀😃✨✔🐱‍🚀🐱‍👓 {{ data.ttt.b }} </template>
      </JGanttColumn>

      <template v-slot:settings>
        <div>
          <p>标题</p>
          <input />
        </div>
      </template>
    </JGantt>

    <button @click="handleClickBg">修改背景色</button>
    <button @click="handleClickModify">修改</button>
    <button @click="handleClickInsert">插入</button>
    <button @click="handleClickInsert2">插入2</button>
    <button @click="handleClickDelete">删除</button>
    <button @click="handleClickColor">切换颜色</button>
    <button @click="() => (showCheckbox = !showCheckbox)">显示checkbox</button>
    <button @click="() => (showWeekend = !showWeekend)">显示weekend</button>
    <button @click="() => (showToday = !showToday)">显示today</button>
    <button @click="() => (showExpand = !showExpand)">显示expand</button>
    <button @click="setSelected">设置选择</button>
  </div>
</template>

<script>
let INDEX = 1;
export default {
  name: "App",

  data() {
    return {
      isDark: false,
      dataList: [],
      showCheckbox: true,
      showWeekend: true,
      showToday: true,
      showExpand: true,
      levelColor: ["azure", "cornsilk"],
      headerStyle: {
        bgColor: "",
        textColor: ""
      },
      bodyStyle: {
        borderColor: "",
        textColor: "",
        todayColor: "",
        weekendColor: "",
        hoverColor: "#f00",
        selectColor: "#0f0"
      }
    };
  },

  created() {
    // 测试数据
    // let s = 2;
    // let e = 15;
    // for (let i = 0; i < 50; i++) {
    //   if (s > e) {
    //     let t = s;
    //     s = e;
    //     e = t;
    //   }
    //   this.dataList.push({
    //     index: i,
    //     startDate: `2020-06-${s++}`,
    //     endDate: `2020-08-${e++}`,
    //     ttt: {
    //       a: "aaa",
    //       b: "bbb"
    //     },
    //     name: "我的数据: " + s,
    //     children: []
    //   });
    //   if (s > 30) s = 2;
    //   if (e > 30) e = 5;
    // }
    // // 二级数据
    // for (let i = 0; i < 5; i++) {
    //   if (s > e) {
    //     let t = s;
    //     s = e;
    //     e = t;
    //   }
    //   [0, 1, 3, 4, 5, 7, 9].forEach(index => {
    //     this.dataList[index]["children"].push({
    //       index: i,
    //       startDate: `2020-06-${s++}`,
    //       endDate: `2020-07-${e++}`,
    //       name: "子数据: " + s,
    //       ttt: {
    //         a: "s-aaa",
    //         b: "s-bbb"
    //       },
    //       children: []
    //     });
    //   });
    //   if (s > 30) s = 2;
    //   if (e > 30) e = 5;
    // }
    // // 三级数据
    // for (let i = 0; i < 5; i++) {
    //   if (s > e) {
    //     let t = s;
    //     s = e;
    //     e = t;
    //   }
    //   [0, 2].forEach(index => {
    //     this.dataList[0]["children"][index]["children"].push({
    //       index: i,
    //       startDate: `2020-07-${s++}`,
    //       endDate: `2020-08-${e++}`,
    //       name: "孙数据: " + s,
    //       ttt: {
    //         a: "gs-aaa",
    //         b: "gs-bbb"
    //       },
    //       children: []
    //     });
    //   });
    //   if (s > 30) s = 2;
    //   if (e > 30) e = 5;
    // }
  },

  methods: {
    rowClick: function(data) {
      console.log("click row data:", data);
    },

    rowDblClick: function(data) {
      console.log("double click row data:", data);
    },

    rowChecked: function(state, data) {
      console.log("check row:", state, data);
    },

    moveSlider: function(newValue, data) {
      console.log("move slider:", newValue, data);
    },

    noTodayError: function() {
      console.log("今天不在范围内");
    },

    merge3: function(data) {
      if (data.index % 3 === 0) return false;
      return true;
    },

    merge4: function(data) {
      if (data.index % 4 === 0) return false;
      return true;
    },

    merge5: function(data) {
      if (data.index % 5 === 0) return true;
      return false;
    },

    handleClickModify: function() {
      Object.assign(this.dataList[0], {
        startDate: "2020-08-10",
        endDate: "2020-09-21"
      });

      Object.assign(this.dataList[0]["children"][2]["children"][0], {
        startDate: `2020-08-13`,
        endDate: `2020-09-17`,
        name: "孙数据: abcde"
      });
    },

    handleClickInsert: function() {
      // 数组的增减，根级操作直接更新，子级操作需要重新赋值，以促使DOM更新
      // 修改原有数据不需要这样的操作，因为内部使用了Proxy
      this.dataList.unshift({
        index: INDEX++,
        startDate: `2020-08-10`,
        endDate: `2020-09-20`,
        name: "数据: " + INDEX,
        ttt: {
          a: "s-aaa" + INDEX,
          b: "s-bbb" + INDEX
        },
        children: []
      });
    },

    handleClickInsert2: function() {
      this.dataList[0]["children"].unshift({
        index: INDEX++,
        startDate: `2020-08-15`,
        endDate: `2020-09-13`,
        name: "子数据: " + INDEX,
        ttt: {
          a: "s-aaa" + INDEX,
          b: "s-bbb" + INDEX
        },
        children: [
          {
            index: INDEX++,
            startDate: `2020-08-21`,
            endDate: `2020-09-5`,
            name: "孙数据: " + INDEX,
            ttt: {
              a: "s-aaa" + INDEX,
              b: "s-bbb" + INDEX
            },
            children: []
          }
        ]
      });
      this.dataList = [...this.dataList];
    },

    handleClickDelete: function() {
      // console.log(this.dataList[0]["children"].pop());
      console.log(this.dataList.shift());
    },

    handleClickColor() {
      this.levelColor = ["green", "yellow", "red"];

      this.headerStyle = {
        bgColor: "black"
      };

      this.bodyStyle = {
        bgColor: "grey"
      };
    },

    handleClickBg() {
      this.isDark = !this.isDark;
    },

    setSelected() {
      this.$refs.gantt.setSelected(this.dataList[0]);
    }
  }
};
</script>

<style lang="stylus">
#app
  width 100%
  height 600px
  color #2c3e50
  margin-top 60px
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
