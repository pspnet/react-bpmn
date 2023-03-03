<script setup lang="ts">
import { inject, isRef, onMounted, Ref, ref, toRaw, watch } from "vue";
import BPMNModdle from "bpmn-moddle";
import elementProperties, { ElementPropertyAttribute } from "../assets/properties";
import { Input } from "ant-design-vue";
import { CustomAdapter } from "../adapter";
import LogicFlow, { EdgeConfig, NodeConfig } from "@logicflow/core";
import Bpmn from "extension/src/main";
import { DndPanel, Menu, SelectionSelect } from "@logicflow/extension";
import patternItems from "../assets/panelItems";
import { lf as lfSymbol } from "../assets/symbol";
import { CustomLogicFlow } from "../types";

const pinia = inject<CustomLogicFlow>(lfSymbol, { lf: undefined });

const canvasRef = ref<HTMLDivElement>();

const modalVisible = ref<boolean>(false);
const formData = ref<BPMNModdle.BaseElement>();
const currentElementProperties = ref<ElementPropertyAttribute[] | []>([]);

watch(
  formData,
  value => {
    console.log(pinia);
    pinia.lf?.render(pinia.bpmnElement);
  },
  { deep: true },
);

const getCustomComponent = (item: ElementPropertyAttribute) => {
  const defaultAttributes = { allowClear: true };
  const defaultFormItem = [Input];
  const [component, options] = item?.component || defaultFormItem;
  return { component, options: { ...defaultAttributes, ...options } };
};

onMounted(async () => {
  const lf: LogicFlow = new LogicFlow({
    container: canvasRef.value!,
    grid: true,
    keyboard: {
      enabled: true,
    },
    plugins: [Bpmn, Menu, DndPanel, SelectionSelect],
  });
  lf.extension.dndPanel.setPatternItems(patternItems);
  const customAdapter = new CustomAdapter(lf, pinia.bpmnElement);
  lf.adapterIn = customAdapter.input();
  lf.adapterOut = customAdapter.output();
  lf._adapter = customAdapter;

  lf.on("element:click", ({ data }) => {
    currentElementProperties.value = [];
    formData.value = customAdapter.getElementById(data.id);
    console.log("element:click formData", formData.value, data);
    if (!formData.value) return;
    const type = ["polyline"].includes(data.type) ? "bpmn:sequenceFlow" : data.type;
    console.log(1111, type, elementProperties[type]?.properties);
    if (type && elementProperties[type]?.properties) {
      currentElementProperties.value = elementProperties[type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("blank:click", data => {
    console.log("blank:click", data);
    currentElementProperties.value = elementProperties["bpmn:process"].properties || [];

    formData.value = customAdapter.getProcess();
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("node:add,edge:add", ({ data }: { data: NodeConfig | EdgeConfig }) => {
    if (!data.id) return;
    pinia.bpmnElement = lf.getGraphData();
  });
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
  lf.render(pinia.bpmnElement);
  pinia.lf = lf;
});
</script>
<template>
  <div class="canvas">
    <div class="canvas" ref="canvasRef"></div>
    <a-drawer
      class="drawer"
      v-model:visible="modalVisible"
      :mask="false"
      title="属性"
      placement="bottom"
      :get-container="false"
    >
      <a-form layout="inline" :model="formData">
        <a-form-item
          v-for="item in currentElementProperties"
          :label="item.label"
          :required="item.required"
        >
          <component
            :is="getCustomComponent(item).component"
            :item="item"
            :bpmn-element="formData"
            v-model:value="formData[item.key]"
          />
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<style scoped>
.canvas {
  height: 100%;
}
</style>
