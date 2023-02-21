<script setup lang="ts">
import {onMounted, ref, watch, reactive} from "vue";
import LogicFlow from '@logicflow/core'
import "@logicflow/core/dist/style/index.css";
import BpmnPlugin from "extension/src/main";

import CustomFormItem from "./components/CustomFormItem.vue";

import BpmnModdle, {BaseElement, Process} from 'bpmn-moddle';

import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import elementProperties from "./assets/properties"
import sample from "./assets/sample"
import xml from "./assets/test"

import type {ElementPropertyAttribute} from "./assets/properties";

const moddle = new BpmnModdle({camunda: camundaModdle});

const lf = ref<LogicFlow>();
const canvasRef = ref<HTMLElement>();
const modalVisible = ref<boolean>(false);

const formData = reactive({});
const currentElementProperties = ref<ElementPropertyAttribute[]>([]);

const config = {
  nodes: [
    {
      id: "1",
      type: "bpmn:ExclusiveGateway",
      x: 100,
      y: 100,
      text: "节点1"
    },
    {
      id: "2",
      type: "bpmn:UserTask",
      x: 300,
      y: 200,
      text: "节点2"
    }
  ],
  edges: [
    {
      sourceNodeId: "1",
      targetNodeId: "2",
      type: "bpmn:SequenceFlow",
      text: "连线"
    }
  ]
}

const dataToXML = () => {
  console.log("data2xml", formData, lf.value);
}

watch(formData, (value) => {
  console.log(666, value);
})

onMounted(async () => {
  //@ts-ignore
  const {rootElement} = await moddle.fromXML(xml);

  const rootElements: BaseElement[] = rootElement.get('rootElements');
  const progress = rootElements.find(element => element.$type === "bpmn:Process") as Process;
  const userTask = moddle.create("bpmn:UserTask", {id: "id_usertask_1", name: "节点2"});
  const progressChildren = progress.get("flowElements");
  progressChildren.push(userTask);

  const diagrams = rootElement.diagrams;
  const plane = diagrams[0].plane;
  const planeElements = plane.get('planeElement');
  planeElements.push(moddle.create('bpmndi:BPMNShape', {
    id: 'Start_di',
    bpmnElement: userTask,
    bounds: moddle.create('dc:Bounds', {x: 50, y: 50, width: 100, height: 100})
  }));

  console.log(123, rootElement, plane);

  //@ts-ignore
  const result = await moddle.toXML(rootElement);

  console.log(rootElement, result, moddle);


  lf.value = new LogicFlow({
    container: canvasRef.value as HTMLElement,
    grid: true,
    plugins: [BpmnPlugin]
  });
  lf.value.on('node:click,edge:click', (data) => {
    console.log("click", data);
    const {type} = data.data;
    if (type && elementProperties[type]?.properties) {
      currentElementProperties.value = elementProperties[type].properties;
    }
    if (!modalVisible.value)
      modalVisible.value = true;
  })
  lf.value.render(config);
})
</script>
<template>
  <div class="canvas" ref="canvasRef"></div>
  <a-drawer
      v-model:visible="modalVisible"
      :mask="false"
      title="Basic Drawer"
      placement="bottom"
  >
    <a-form layout="inline" :model="formData">
      <a-form-item v-for="item in currentElementProperties" :label="item.label" :required="item.required">
        <custom-form-item :item="item" v-model:value="formData[item.key]"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="dataToXML">toXML</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>