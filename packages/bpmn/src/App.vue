<script setup lang="ts">
import { provide, ref, watch } from "vue";

import CustomToolbar from "./components/CustomToolbar.vue";
import CustomEditor from "./components/CustomEditor.vue";
import CustomDesigner from "./components/CustomDesigner.vue";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import { props as propsSymbol } from "./assets/symbol";
import { adapterIn, adapterOut, defaultDefinitions, moddle } from "./adapter";
import LogicFlow, { GraphConfigData } from "@logicflow/core";

import { DefinitionsXml, CustomProps } from "./types";
import { Definitions } from "bpmn-moddle";

const lf = ref<LogicFlow>();

const graphConfig = ref<GraphConfigData | undefined>();
const bpmnElement = ref<Definitions>(defaultDefinitions());
//@ts-ignore
const bpmnXml = ref<DefinitionsXml>({ xml: "" });
provide<CustomProps>(propsSymbol, { lf, graphConfig, bpmnElement, bpmnXml });

const versions = [1, 1, 1];

watch(graphConfig, value => {
  console.log("watch config", value);
  if (!value || !lf.value) return;
  versions[0] += 1;
  if (versions[0] > versions[1]) {
    adapterOut(lf.value, bpmnElement.value)(value);
    //@ts-ignore
    bpmnElement.value.exporterVersion = Math.random().toString();
  }
});

watch(
  bpmnElement,
  async value => {
    console.log("watch bpmnElement", value);
    versions[1] += 1;
    if (versions[1] > versions[0]) {
      const data = adapterIn()(value);
      graphConfig.value = data;
      lf.value?.render(data);
    }
    if (versions[1] > versions[2]) {
      //@ts-ignore
      bpmnXml.value = await moddle.toXML(value, { format: true });
    }
  },
  { deep: true, immediate: false },
);

watch(bpmnXml, async value => {
  console.log("watch bpmnXml", value);
  versions[2] += 1;
  if (versions[2] > versions[1]) {
    //@ts-ignore
    const { rootElement } = await moddle.fromXML(value.xml);
    bpmnElement.value = rootElement;
  }
});

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
