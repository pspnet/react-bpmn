<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed, toRaw } from "vue";
import LogicFlow, { GraphModel } from "@logicflow/core";
import { Menu, DndPanel, SelectionSelect } from "@logicflow/extension";
import Bpmn from "extension/src/main";

import CustomToolbar from "./components/CustomToolbar.vue";
import CustomEditor from "./components/CustomEditor.vue";

import { adapterIn, adapterOut } from "./adapter";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import patternItems from "./assets/panelItems";
import elementProperties from "./assets/properties";

import BpmnModdle from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import xml from "./assets/sample";
import BPMNModdle from "bpmn-moddle";
import properties from "./assets/properties";

const moddle = new BpmnModdle({ camunda: camundaModdle });

const definitions = ref<BPMNModdle.Definitions>();

const canvasRef = ref<HTMLDivElement>();
const xmlVisibleRef = ref<boolean>(false);
const modalVisible = ref<boolean>(false);
const formData = reactive({});

const lf = ref<LogicFlow>();
const graphData = computed(() => lf.value?.getGraphData());
// watch(graphData, value => {
//   console.log("watch graphData", value);
// });

const getProperties = (type: string) => {
  return properties[type];
};

onMounted(async () => {
  // @ts-ignore
  const { rootElement } = await moddle.fromXML(xml);
  definitions.value = <BPMNModdle.Definitions>rootElement;

  lf.value = new LogicFlow({
    container: canvasRef.value!,
    grid: true,
    keyboard: {
      enabled: true,
    },
    plugins: [Bpmn, Menu, DndPanel, SelectionSelect],
  });
  lf.value.extension.dndPanel.setPatternItems(patternItems);
  lf.value.adapterIn = adapterIn;
  // lf.value.adapterOut = adapterOut;

  lf.value.on("element:click", ({ data }) => {
    console.log("element:click", data, data.properties._bpmnElement);
  });
  lf.value.on("blank:click", data => {
    console.log("blank:click", data);
  });
  lf.value.on("node:add,edge:add", data => {
    console.log("node:add,edge:add", data);
  });
  console.log(12311, definitions.value);
  const json = {
    nodes: [
      {
        id: "StartEvent_1sc8phk",
        type: "bpmn:startEvent",
        text: "节点1",
        properties: {},
        x: 160,
        y: 100,
      },
      {
        id: "UserTask_0to9qv1",
        type: "bpmn:userTask",
        text: "节点2",
        properties: {},
        x: 360,
        y: 200,
      },
    ],
    edges: [
      {
        id: "FLOW_3aed1n8",
        type: "polyline",
        sourceNodeId: "StartEvent_1sc8phk",
        targetNodeId: "UserTask_0to9qv1",
      },
    ],
  };
  const graphData = {
    nodes: [
      {
        id: "node_id_1",
        type: "bpmn:userTask",
        x: 100,
        y: 100,
        text: { x: 100, y: 100, value: "节点1" },
        properties: {},
      },
      {
        id: "node_id_2",
        type: "bpmn:startEvent",
        x: 200,
        y: 300,
        text: { x: 300, y: 300, value: "节点2" },
        properties: {},
      },
    ],
    edges: [
      {
        id: "edge_id",
        type: "polyline",
        sourceNodeId: "node_id_1",
        targetNodeId: "node_id_2",
        text: { x: 139, y: 200, value: "连线" },
        properties: {},
      },
    ],
  };
  lf.value.render(definitions.value);
});
</script>
<template>
  <div class="container">
    <custom-toolbar @xml="xmlVisibleRef = !xmlVisibleRef" />
    <div v-show="!xmlVisibleRef" class="canvas" ref="canvasRef"></div>
    <custom-editor v-show="xmlVisibleRef" class="canvas" />

    <a-drawer v-model:visible="modalVisible" :mask="false" title="Basic Drawer" placement="bottom">
      <a-form layout="inline" :model="formData">
        <a-form-item
          v-for="item in currentElementProperties"
          :label="item.label"
          :required="item.required"
        >
          <custom-form-item :item="item" v-model:value="formData[item.key]" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary">toXML</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
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
