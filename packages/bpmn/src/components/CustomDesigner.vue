<script setup lang="ts">
import {h, inject, onMounted, ref, watch} from "vue";
import BPMNModdle from "bpmn-moddle";
import elementProperties, {ElementPropertyAttribute} from "../assets/properties";
import LogicFlow, {EdgeConfig, NodeConfig} from "@logicflow/core";
import Bpmn from "extension/src/main";
import {DndPanel, Menu, SelectionSelect} from "@logicflow/extension";
import patternItems from "../assets/panelItems";
import {props as propsSymbol} from "../assets/symbol";
import {CustomProps} from "../types";
import {customModdle} from "../adapter";

import CustomFormItem from "./form/CustomFormItem.vue";
import {Input} from "ant-design-vue";

const pinia = inject<CustomProps>(propsSymbol);

const canvasRef = ref<HTMLDivElement>();
const modalVisible = ref<boolean>(false);
const formData = ref<BPMNModdle.BaseElement>();
const currentElementProperties = ref<ElementPropertyAttribute[] | []>([]);
const currentElementData = ref<NodeConfig | EdgeConfig | undefined>();

watch(
    () => [pinia!.bpmnElement.value, currentElementData.value],
    ([bpmnElement, selectedData]) => {
      //TODO: change formData
      console.log("watch changedForm data", bpmnElement, selectedData);
      if (!selectedData) {
        formData.value = customModdle(pinia?.bpmnElement.value).getProcess();
        return;
      }
      formData.value = customModdle(pinia?.bpmnElement.value).getElementById(
          selectedData!.id as string,
      );
    },
    {immediate: true},
);

watch(
    formData,
    (value: BPMNModdle.BaseElement | undefined) => {
      console.log("watch formdata", value, pinia?.graphConfig.value);
      if (!value?.id) return;
      customModdle(pinia?.bpmnElement.value).setElement(value.id, value);
    },
    {deep: true},
);

const getCustomComponent = (item: ElementPropertyAttribute) => {
  const defaultAttributes = {allowClear: true};
  const defaultFormItem = [Input];
  const [component, options] = item?.component || defaultFormItem;
  return {component, options: {...defaultAttributes, ...options}};
};

onMounted(async () => {
  const lf = new LogicFlow({
    container: canvasRef.value!,
    grid: true,
    keyboard: {
      enabled: true,
    },
    plugins: [Bpmn, Menu, DndPanel, SelectionSelect],
  });
  lf.extension.dndPanel.setPatternItems(patternItems);

  lf.on("element:click", ({data}) => {
    currentElementProperties.value = [];
    currentElementData.value = data;
    const type = ["polyline"].includes(data.type) ? "bpmn:sequenceFlow" : data.type;
    if (type && elementProperties[type]?.properties) {
      currentElementProperties.value = elementProperties[type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("blank:click", data => {
    currentElementProperties.value = elementProperties["bpmn:process"].properties || [];
    currentElementData.value = undefined;
    console.log("blank:click", data, formData.value);
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("node:add,edge:add", ({data}: { data: NodeConfig | EdgeConfig }) => {
    if (!data.id) return;
    pinia!.graphConfig.value = lf.getGraphData();
    console.log("node:add,edge:add", pinia?.graphConfig.value, lf.getGraphData());
  });
  lf.on("node:delete,edge:delete", data => {
    if (!data.id) return;
    //TODO:
    pinia!.graphConfig.value = lf.getGraphData();
    console.log("node:delete,edge:delete", data, lf.getGraphData(), pinia?.graphConfig.value);
  });
  if (!pinia?.graphConfig.value) pinia!.graphConfig.value = {nodes: [], edges: []};
  lf.render(pinia!.graphConfig.value);
  pinia!.lf.value = lf;
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
      <a-tabs tabPosition="right">
        <a-tab-pane key="1" tab="属性">
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
        </a-tab-pane>
        <a-tab-pane tab="扩展">
        </a-tab-pane>
        <a-tab-pane tab="事件">
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </div>
</template>
<style scoped>
.canvas {
  height: 100%;
}
</style>
