

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
      @click="handClick(item.title)">
      <i :class="'icon-'+item.icon"  style="display:inline-block;font-size:25px"></i>
    
      <div>{{item.title}}</div>
    </div>
  </div>
  <canvas id="myCanvas"
    style="display:none"></canvas>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { fabric } from "fabric-with-erasing";
import 'fabric-history';



const bottomArr = [{title:"页面",icon:'zhuye'},{title:"鼠标",icon:'shubiao'} ,{title:"画板",icon:'huahua'} ,{title:"橡皮擦",icon:'rubber'},{title:"撤销",icon:'chexiao'}];
// 在全局定义 canvas
let canvas = ref(null);
let canvasDom = ref(null);
let showBox = ref(true);
let paint = ref(null);
// 创建一个变量来跟踪事件监听器的注册状态
let isPathCreatedHandlerRegistered = ref(null);
let listeners = ref(null);


const toggleBox = () => {

  showBox.value = !showBox.value; // 点击按钮切换盒子的显示隐藏状态
};
//自定义鼠标样式
const createCursorStyle = (id) => {
  const elementToRemove = document.getElementById('customCursor');
if (elementToRemove) elementToRemove.remove();
  const opera=id==='画板'
  canvas.value.hoverCursor = 'none';
  
  // 创建自定义鼠标样式对象
  const customCursor = document.createElement('div');
  customCursor.setAttribute('id', 'customCursor');
  customCursor.style.width = '30px';
  customCursor.style.height = '30px';
  if(opera){
  // customCursor.style.background = `url(${pencil}) no-repeat center/cover`;
  customCursor.className = `icon-qianbi`;
  customCursor.style.fontSize = '40px';

  }else{
      customCursor.style.border = '3px solid #ffffff';
  customCursor.style.background = 'red';
  customCursor.style.borderRadius = '50%';
  }

  customCursor.style.position = 'absolute';
  customCursor.style.pointerEvents = 'none';
  customCursor.style.display = 'none';
 
  // 设置自定义鼠标样式
  canvas.value.upperCanvasEl.style.cursor = 'none';
  canvas.value.wrapperEl.appendChild(customCursor);
 
  // 存储事件监听器的引用
  const mouseMoveListener = (event) => {
    canvas.value.upperCanvasEl.style.cursor = 'none';
    const pointer = canvas.value.getPointer(event.e);
    customCursor.style.left = pointer.x + 25 + 'px';
    customCursor.style.left = opera ? (pointer.x + 25 + 'px') : (pointer.x - 25 + 'px');

    customCursor.style.top = pointer.y - 25 + 'px';
  };
  
  const mouseOutListener = () => {
    customCursor.style.display = 'none';
  };
  
  const mouseOverListener = () => {
    customCursor.style.display = 'block';
  };

  // 添加事件监听器
  canvas.value.on('mouse:move', mouseMoveListener);
  canvas.value.on('mouse:out', mouseOutListener);
  canvas.value.on('mouse:over', mouseOverListener);

  // 返回事件监听器引用，以便稍后取消
  return {
    mouseMoveListener,
    mouseOutListener,
    mouseOverListener
  };
};
const removeCursorStyle = (listeners) => {
  // 取消事件监听器
  canvas.value.off('mouse:move', listeners.mouseMoveListener);
  canvas.value.off('mouse:out', listeners.mouseOutListener);
  canvas.value.off('mouse:over', listeners.mouseOverListener);

};
const initCanvas = () => {
  console.log(canvas.value);
  if (canvas.value) {
    // 清除之前的笔画痕迹
    canvas.value.clear();
     // 移除之前的事件监听器
     removeCursorStyle(listeners.value);
     listeners.value=null
    return;
  }

  canvas.value = new fabric.Canvas("myCanvas", {
    isDrawingMode: true, // 开启绘图模式
  });
  // 设置画笔颜色
  canvas.value.freeDrawingBrush.color = "#11999e";

  // 设置画笔粗细
  canvas.value.freeDrawingBrush.width = 10;
  //存储初始画笔
  paint.value=canvas.value.freeDrawingBrush;



   // 创建并存储事件监听器引用
   listeners.value= createCursorStyle("画板");

};
   // 创建一条红色线条
   const  addSimulatePoint=()=> {
    

    
var point = new fabric.Circle({
  left: 0,
  top: 0,
  radius: 1,
  fill: 'red',
  selectable: false, // 禁止选择
  evented: false, // 禁止触发事件
  visible:false
});
// 设置唯一标识符避免橡皮擦划到去创建新的元素
point.set('id', 'simulate');
    // 将红色线条添加到画布中
    canvas.value.add(point);
    // canvas.value.renderAll();
  }
    // 创建线条后的交互查询
    const  intersects=(e)=> {
     // 获取当前画布上的所有元素
  const objects = canvas.value.getObjects();

console.log(objects)
  // 循环遍历画布上的每个对象执行交叉检测
  //一次擦除可能跨越多条路径
const result=  objects.some(object => {
    // 执行交叉检测
    const isIntersecting = object.intersectsWithObject(e.path);
   return isIntersecting && object.id !=='simulate'
      console.log(`元素 ${object} 与捕获到的路径存在交叉`);
     
    
  });
  if(result)  addSimulatePoint()

  }
const handClick = (id) => {
  if( listeners.value){
  removeCursorStyle(listeners.value);
  listeners.value=null
}
  switch (id) {
    
    case "页面":
    if (canvas.value) canvas.value.isDrawingMode=false;
      window.electronAPI.showWin("showWin");
      window.electronAPI.mouseAcross(true, { forward: true });
      break;
    case "鼠标":
      //解决鼠标为画板时点击鼠标按钮后鼠标样式错乱问题.但是 不允许绘画（返回普通框选模式）
    if (canvas.value) canvas.value.isDrawingMode=false;

      window.electronAPI.mouseAcross(true, { forward: true });
      break;
    case "画板":
      if (canvasDom.value.style.display === "block") {
        // 创建并存储事件监听器引用
   listeners.value= createCursorStyle("画板");
        //点击橡皮擦后在点击画板后需要将freeDrawingBrush设为初始画笔
        canvas.value.freeDrawingBrush=paint.value
        //点击鼠标再点击画板需要打开绘画模式
        canvas.value.isDrawingMode=true;
        // canvasDom.value.style.display = "none";
        // if (canvas.value) {
        //   console.log(canvas.value)
        //   canvas.value.dispose();
        //   canvas.value = null;
        // }
      } else {
        canvasDom.value.style.display = "block";
        canvasDom.value.setAttribute("width", window.screen.width);
        canvasDom.value.setAttribute("height", window.screen.availHeight);
        initCanvas();
      }  break;
      case '橡皮擦':
      if (canvas.value && !isPathCreatedHandlerRegistered.value){
        listeners.value= createCursorStyle("橡皮擦");
        canvas.value.isDrawingMode = true // 进入绘画模式
        canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas.value) // 使用橡皮擦画笔
        canvas.value.freeDrawingBrush.width = 30 // 设置画笔粗细为 10


// 监听自由绘制路径的添加事件
isPathCreatedHandlerRegistered.value=canvas.value.on('path:created', intersects);

      };
      break;

      
      case '撤销':
      // const json = canvas.value.toJSON().objects;
      // console.log(json)
      //   console.log(canvas.value._objects)
      if (canvas.value) canvas.value.isDrawingMode=false;
      canvas.value.undo();
   
        //只是画笔的数组
        // console.log(canvas.value._objects)
        //单次撤销不可以撤销橡皮擦的操作
        // canvas.value.remove(canvas.value._objects[canvas.value._objects.length-1]);
    
   
        break;
    default:
 
      // 处理其他情况
      break;
  }
        // 取消事件监听器
    
       if (isPathCreatedHandlerRegistered.value && id!=='橡皮擦') {
  // 取消事件监听器
  canvas.value.off('path:created', intersects);
  isPathCreatedHandlerRegistered.value=null
  
}}

const mouseHandle = async() => {
  window.electronAPI.mouseAcross(false);
};

onMounted( () => {
  canvasDom.value = document.getElementById("myCanvas");
});
</script>
<style scoped>
.triangle {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

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
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  /* position: absolute;
 
  bottom: 0px;
  right: 600px; */
  /* visibility: hidden; */
  width: 500px;
  height: 60px;
  background-color: black; /* 修改颜色以符合你的需求 */
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.button {
  /* padding: 10px; */
  cursor: pointer;
  color: lightblue; /* 修改颜色以符合你的需求 */
  width:70px
}
.button:hover {
  background-color: white; 
}
#myCanvas {
  /* position: re; */
}
</style>
