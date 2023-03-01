<script setup lang="ts">
import { provide, ref } from "vue";

import CustomToolbar from "./components/CustomToolbar.vue";
import CustomEditor from "./components/CustomEditor.vue";
import CustomDesigner from "./components/CustomDesigner.vue";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import { lf as lfSymbol, moddleElementMap as moddleElementMapSymbol } from "./assets/symbol";
import LogicFlow from "@logicflow/core";
import BPMNModdle from "bpmn-moddle";

const lf = ref<LogicFlow>();

provide(lfSymbol, lf);

const xmlVisible = ref<boolean>(false);

const triggerXmlView = async () => {
  xmlVisible.value = !xmlVisible.value;
};
</script>
<template>
  <div class="container">
    <custom-toolbar @xml="triggerXmlView" />
    <custom-editor class="editor" v-show="xmlVisible" :visible="xmlVisible" />
    <custom-designer class="designer" v-show="!xmlVisible"></custom-designer>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.container > .editor {
  flex: 1;
}

.container > .designer {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.container > .designer:deep(.drawer) {
  position: absolute;
}
</style>
