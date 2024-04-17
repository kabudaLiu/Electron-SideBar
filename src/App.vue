

<template>
  <div id="box">111111111</div>

</template>
<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted } from "vue";
// import { remote } from "@electron/remote";

// const {remote} = require('@electron/remote');
// import { remote } from "electron";
// const win = require("electron").remote.getCurrentWindow();
onMounted(() => {
  const setButton = document.getElementById("box");
  setButton.addEventListener("click", (e) => {
    e.stopPropagation();
    window.electronAPI.showWin("showWin");
  });
  setButton.addEventListener("mouseenter", (e) => {
    // console.log(remote.getCurrentWindow(), 22222);
    window.electronAPI.getCurrentWindow(1);
  });
  setButton.addEventListener("mouseleave", (e) => {
    e.stopPropagation();
    window.electronAPI.getCurrentWindow(2);

    //  window.electronAPI.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true })
  });
});
</script>
<style scoped>
#box {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 500px;
  background-color: lightblue; /* 修改颜色以符合你的需求 */
}
</style>
