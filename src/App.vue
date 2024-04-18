

<template>
  <!-- 控制显示隐藏的按钮 -->
  <div class="triangle"
    :class="{ 'triangle-up': showBox, 'triangle-down': !showBox }"
    @click="toggleBox">
    <!-- 三角形 -->
  </div>
  <div id="box"
    v-show="showBox"
    @mouseenter="mouseHandle">
    <div v-for="(item,index) in bottomArr"
      class="button"
      :id='item'
      :key="index"
      @click="handClick(item)">
      {{item}}
    </div>
  </div>
  <canvas id="myCanvas"
    style="display:none"></canvas>
</template>
<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted, ref } from "vue";
import { fabric } from "fabric";
const bottomArr = ["页面", "鼠标", "画板"];
// 在全局定义 canvas
let canvas = ref(null);
let canvasDom = ref(null);
let showBox = ref(true);

const toggleBox = () => {
  showBox.value = !showBox.value; // 点击按钮切换盒子的显示隐藏状态
};
const initCanvas = () => {
  console.log(canvas.value);
  if (canvas.value) {
    // 清除之前的笔画痕迹
    canvas.value.clear();
    return;
  }

  canvas.value = new fabric.Canvas("myCanvas", {
    isDrawingMode: true, // 开启绘图模式
  });
  // 设置画笔颜色
  canvas.value.freeDrawingBrush.color = "#11999e";

  // 设置画笔粗细
  canvas.value.freeDrawingBrush.width = 10;
};
const handClick = (id) => {
  switch (id) {
    case "页面":
      window.electronAPI.showWin("showWin");
      window.electronAPI.mouseAcross(true, { forward: true });
      break;
    case "鼠标":
      window.electronAPI.mouseAcross(true, { forward: true });
      break;
    case "画板":
      if (canvasDom.value.style.display === "block") {
        canvasDom.value.style.display = "none";
        if (canvas.value) {
          canvas.value.dispose();
          canvas.value = null;
        }
      } else {
        canvasDom.value.style.display = "block";
        canvasDom.value.setAttribute("width", window.screen.width);
        canvasDom.value.setAttribute("height", window.screen.availHeight);
        initCanvas();
      }
      break;
    default:
      // 处理其他情况
      break;
  }
};
const mouseHandle = () => {
  window.electronAPI.mouseAcross(false);
};
onMounted(() => {
  canvasDom.value = document.getElementById("myCanvas");
});
</script>
<style scoped>
.triangle {
  position: absolute;
  z-index: 1;
  bottom: 50px;
  right: 850px;
  cursor: pointer;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}

.triangle-up {
  /* 调整三角形得高度 */
  border-bottom: 10px solid black;
}

.triangle-down {
  border-top: 10px solid black;
  bottom: 0px;
}
#box {
  position: absolute;
  z-index: 1;
  bottom: 0px;
  right: 600px;
  /* visibility: hidden; */
  width: 500px;
  height: 50px;
  background-color: black; /* 修改颜色以符合你的需求 */
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.button {
  padding: 10px;
  cursor: pointer;
  color: lightblue; /* 修改颜色以符合你的需求 */
}
.button:hover {
  background-color: white; /* 修改颜色以符合你的需求 */
}
#myCanvas {
  /* position: re; */
}
</style>
