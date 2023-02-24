<script setup lang="ts">
import { ref, onMounted } from "vue";
import LogicFlow from "@logicflow/core";
import { MiniMap } from "@logicflow/extension";

import CustomToolbar from "./components/CustomToolbar.vue";
import CustomEditor from "./components/CustomEditor.vue";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

const canvasRef = ref<HTMLDivElement>();
const xmlVisibleRef = ref<boolean>(false);

onMounted(() => {
  const lf: LogicFlow = new LogicFlow({
    container: canvasRef.value!,
    grid: true,
    keyboard: {
      enabled: true,
    },
    plugins: [MiniMap],
  });
  lf.adapterIn = userData => {
    const nodes = userData.nodess;
    return { nodes, edges: [] };
  };
  lf.render({ nodess: [{ type: "rect", x: 100, y: 100, text: "HelloWorld" }] });
});
</script>
<template>
  <div class="container">
    <custom-toolbar @xml="xmlVisibleRef = !xmlVisibleRef" />
    <div v-show="!xmlVisibleRef" class="canvas" ref="canvasRef"></div>
    <custom-editor v-show="xmlVisibleRef" class="canvas" />
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.container > .canvas {
  flex: 1;
}
</style>
