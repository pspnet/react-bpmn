<script setup lang="ts">
import {onMounted, ref, reactive} from "vue";
import LogicFlow from '@logicflow/core'
import "@logicflow/core/dist/style/index.css";
import BpmnPlugin from "extension/src/main";

import BpmnModdle from 'bpmn-moddle';

import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';

const moddle = new BpmnModdle({camunda: camundaModdle});

const serviceTask = moddle.create('bpmn:ServiceTask', {
  'javaDelegate': 'my.company.SomeDelegate'
});

console.log(serviceTask, moddle, camundaModdle);

const canvasRef = ref(null);
const modalVisible = ref<boolean>(false);

const modelRef = reactive({
  name: '',
  region: undefined,
  type: [],
});

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

console.log(canvasRef.value);

onMounted(() => {
  const lf = new LogicFlow({
    container: canvasRef.value as unknown as HTMLElement,
    grid: true,
    plugins: [BpmnPlugin]
  });
  lf.on('node:click,edge:click', (data) => {
    console.log("click", data);
    if (!modalVisible.value)
      modalVisible.value = true;
  })
  lf.render(config);
})
</script>
<template>
  <div class="canvas" ref="canvasRef"></div>
  <a-drawer
      v-model:visible="modalVisible"
      :mask="false"
      title="Basic Drawer"
      placement="right"
  >
    <a-form>
      <a-form-item label="Activity name" required>
        <a-input v-model:value="modelRef.name"/>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>