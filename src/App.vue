

<template>
  <div id="box">
    <div v-for="(item,index) in bottomArr"
      :key="index">
      {{item}}
    </div>
  </div>

</template>
<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted } from "vue";
const bottomArr = ["鼠标", "画板"];
onMounted(() => {
  const setButton = document.getElementById("box");
  setButton.addEventListener("click", (e) => {
    e.stopPropagation();
    window.electronAPI.showWin("showWin");
  });
  setButton.addEventListener("mouseenter", (e) => {
    // console.log(remote.getCurrentWindow(), 22222);
    window.electronAPI.mouseAcross(1);
  });
  setButton.addEventListener("mouseleave", (e) => {
    e.stopPropagation();
    window.electronAPI.mouseAcross(2);

    //  window.electronAPI.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
  });
});
</script>
<style scoped>
#box {
  position: absolute;
  bottom: 0px;
  right: 600px;

  width: 500px;
  height: 50px;
  background-color: lightblue; /* 修改颜色以符合你的需求 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
</style>
