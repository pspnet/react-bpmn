<script setup lang="ts">
import { inject, onMounted, Ref, ref } from "vue";
import BPMNModdle from "bpmn-moddle";
import elementProperties, { ElementPropertyAttribute } from "../assets/properties";
import { Input } from "ant-design-vue";
import { adapterIn, adapterOut } from "../adapter";
import LogicFlow from "@logicflow/core";
import Bpmn from "extension/src/main";
import { DndPanel, Menu, SelectionSelect } from "@logicflow/extension";
import patternItems from "../assets/panelItems";
import { lf as lfSymbol } from "../assets/symbol";

const lfRef = inject<Ref<LogicFlow>>(lfSymbol);
const canvasRef = ref<HTMLDivElement>();

const modalVisible = ref<boolean>(false);
const formData = ref<BPMNModdle.BPMNModdle>();
const currentElementProperties = ref<ElementPropertyAttribute[] | []>([]);

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
  lf.adapterIn = adapterIn();
  lf.adapterOut = adapterOut(lf);

  lf.on("element:click", ({ data }) => {
    console.log("element:click", data);
    currentElementProperties.value = [];
    // formData.value = data.properties._bpmnElement;
    // formData.value = elementsById[data.id];
    if (data.type && elementProperties[data.type]?.properties) {
      currentElementProperties.value = elementProperties[data.type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("blank:click", data => {
    console.log("blank:click", data);
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("node:add,edge:add", data => {
    console.log("node:add,edge:add", data, lf.getGraphData());
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
  const definitions = lf.getGraphData();
  lf.render(definitions);
  lfRef!.value = lf;
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
