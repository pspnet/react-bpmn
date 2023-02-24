<script setup lang="ts">
import { onMounted, ref, watch, reactive, computed } from "vue";
import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import { Menu, DndPanel, SelectionSelect } from "@logicflow/extension";
import Bpmn from "extension/src/main";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import "bpmn-font/dist/css/bpmn.css";

import CustomFormItem from "./components/CustomFormItem.vue";
import { DataAdapterIn, DataAdapterOut } from "./adapter";

import elementProperties from "./assets/properties";

import type { ElementPropertyAttribute } from "./assets/properties";
import Moddle, { BPMNModdle } from "bpmn-moddle";
import type { BaseElement, Process } from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import patternItems from "./assets/panelItems";

const moddle: BPMNModdle = new Moddle({ camunda: camundaModdle });

const lf = ref<LogicFlow>();
const canvasRef = ref<HTMLElement>();
const modalVisible = ref<boolean>(false);

const formData = reactive({});
const currentElementProperties = ref<ElementPropertyAttribute[]>([]);

// const config: GraphConfigData = {
//   nodes: [
//     {
//       id: "StartEvent_1sc8phk",
//       type: "bpmn:startEvent",
//       x: 160,
//       y: 100,
//       text: "节点1",
//     },
//     {
//       id: "UserTask_0to9qv1",
//       type: "bpmn:userTask",
//       x: 360,
//       y: 200,
//       text: "节点2",
//     },
//   ],
//   edges: [
//     {
//       id: "FLOW_3aed1n8",
//       type: "polyline",
//       sourceNodeId: "StartEvent_1sc8phk",
//       targetNodeId: "UserTask_0to9qv1",
//       text: "连线连线连线",
//       // text: { value: "连线", x: 282, y: 153 },
//       // pointsList: [
//       //   { x: 178, y: 100 },
//       //   { x: 280, y: 100 },
//       //   { x: 280, y: 200 },
//       //   { x: 310, y: 200 },
//       // ],
//     },
//   ],
// };

const graphData = ref<GraphConfigData>({ nodes: [], edges: [] });

const elementMap = computed(() => {
  const map: { [key: string]: NodeConfig | EdgeConfig } = {};
  if (!lf.value) return map;
  const { nodes, edges }: GraphConfigData = lf.value.getGraphData();
  nodes.forEach(node => {
    if (node.id) map[node.id] = node;
  });
  edges.forEach(edge => {
    if (edge.id) map[edge.id] = edge;
  });
  return map;
});

const dataToXML = () => {
  console.log("data2xml", formData, lf.value);
};

watch(formData, value => {
  console.log("formData", value);
});

const getTypeName = (type: string): string => {
  const name: string = type.replace("bpmn:", "").replace("bpmn2:", "");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

onMounted(async () => {
  lf.value = new LogicFlow({
    container: canvasRef.value as HTMLElement,
    grid: true,
    plugins: [Menu, DndPanel, SelectionSelect, Bpmn],
  });
  lf.value.extension.dndPanel.setPatternItems(patternItems);
  lf.value.on("node:add", ({ data }) => {
    const { id, type } = data;
    const bpmnModdle = moddle.create(`bpmn:${getTypeName(type)}`);
    elementMap.value[id].properties._bpmnModdle = bpmnModdle;
    console.log("node:add", data, elementMap.value[id], graphData.value);
  });
  lf.value.on("element:click", data => {
    console.log("element:click", data);
  });
  lf.value.on("blank:click", data => {
    console.log("blank:click", data);
  });
  lf.value.on("node:click,edge:click", data => {
    const { type } = data.data;
    console.log("click", data, type, elementProperties);
    if (type && elementProperties[type]?.properties) {
      currentElementProperties.value = elementProperties[type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.value.render(graphData.value);
  // const xml = await new DataAdapterOut(lf.value).configToXml();
  // const moddle = await new DataAdapterIn(lf.value).xmlToConfig(xml.xml);
  // console.log("xml", xml, moddle);
});
</script>
<template>
  <div class="canvas" ref="canvasRef"></div>
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
        <a-button type="primary" @click="dataToXML">toXML</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
