<script setup lang="ts">
import { onMounted, ref, watch, reactive } from "vue";
import LogicFlow, { GraphConfigData } from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import BpmnPlugin from "extension/src/main";

import CustomFormItem from "./components/CustomFormItem.vue";
import DataAdapter from "./util";

import elementProperties from "./assets/properties";

import type { ElementPropertyAttribute } from "./assets/properties";

const lf = ref<LogicFlow>();
const canvasRef = ref<HTMLElement>();
const modalVisible = ref<boolean>(false);

const formData = reactive({});
const currentElementProperties = ref<ElementPropertyAttribute[]>([]);

const config: GraphConfigData = {
  nodes: [
    {
      id: "StartEvent_1sc8phk",
      type: "bpmn:startEvent",
      x: 160,
      y: 100,
      text: "节点1",
    },
    {
      id: "UserTask_0to9qv1",
      type: "bpmn:userTask",
      x: 360,
      y: 200,
      text: "节点2",
    },
  ],
  edges: [
    {
      id: "FLOW_3aed1n8",
      type: "polyline",
      sourceNodeId: "StartEvent_1sc8phk",
      targetNodeId: "UserTask_0to9qv1",
      text: "连线连线连线",
      // text: { value: "连线", x: 282, y: 153 },
      // pointsList: [
      //   { x: 178, y: 100 },
      //   { x: 280, y: 100 },
      //   { x: 280, y: 200 },
      //   { x: 310, y: 200 },
      // ],
    },
  ],
};

const dataToXML = () => {
  console.log("data2xml", formData, lf.value);
};

watch(formData, value => {
  console.log("formData", value);
});

onMounted(async () => {
  lf.value = new LogicFlow({
    container: canvasRef.value as HTMLElement,
    grid: true,
    plugins: [BpmnPlugin],
  });
  lf.value.on("node:click,edge:click", data => {
    console.log("click", data);
    const { type } = data.data;
    if (type && elementProperties[type]?.properties) {
      currentElementProperties.value = elementProperties[type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.value.render(config);
  const dataAdapterInstance = new DataAdapter(lf.value);
  const text = await dataAdapterInstance.configToXML();
  console.log("xml", text);
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
