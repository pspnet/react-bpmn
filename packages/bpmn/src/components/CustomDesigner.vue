<script setup lang="ts">
import { h, inject, onMounted, ref, watch } from "vue";
import BPMNModdle from "bpmn-moddle";
import { ElementAttribute, elementsByType, EntryAttribute } from "../assets/properties";
import LogicFlow, { EdgeConfig, NodeConfig } from "@logicflow/core";
import Bpmn from "extension/src/main";
import { DndPanel, Menu, SelectionSelect } from "@logicflow/extension";
import patternItems from "../assets/panelItems";
import { props as propsSymbol } from "../assets/symbol";
import { CustomProps } from "../types";
import { customModdle } from "../adapter";

import { Form, Input } from "ant-design-vue";
import { BorderLeftOutlined } from "@ant-design/icons-vue";

const pinia = inject<CustomProps>(propsSymbol);

const canvasRef = ref<HTMLDivElement>();
const modalVisible = ref<boolean>(false);
const formData = ref<BPMNModdle.BaseElement>();
const currentElementDefinition = ref<ElementAttribute>();
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
  { immediate: true },
);

watch(
  formData,
  (value: BPMNModdle.BaseElement | undefined) => {
    console.log("watch formdata", value, pinia?.graphConfig.value);
    if (!value?.id) return;
    customModdle(pinia?.bpmnElement.value).setElement(value.id, value);
  },
  { deep: true },
);

const getCustomComponent = (entry: EntryAttribute) => {
  const defaultAttributes = { allowClear: true };
  const defaultFormItem = [Input];
  const [component, options] = entry?.component || defaultFormItem;
  return { component, options: { ...defaultAttributes, ...options } };
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

  lf.on("element:click", ({ data }) => {
    currentElementDefinition.value = undefined;
    currentElementData.value = data;
    const type = ["polyline"].includes(data.type) ? "bpmn:sequenceFlow" : data.type;
    if (type && elementsByType[type]) {
      currentElementDefinition.value = elementsByType[type];
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("blank:click", data => {
    currentElementDefinition.value = elementsByType["bpmn:process"] || [];
    currentElementData.value = undefined;
    console.log("blank:click", data, formData.value);
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.on("node:add,edge:add", ({ data }: { data: NodeConfig | EdgeConfig }) => {
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
  if (!pinia?.graphConfig.value) pinia!.graphConfig.value = { nodes: [], edges: [] };
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
      :title="currentElementDefinition?.label"
      placement="right"
      :mask="false"
      :get-container="false"
    >
      <a-form :model="formData" layout="vertical">
        <a-tabs tabPosition="top" size="small">
          <a-tab-pane
            v-for="group in currentElementDefinition?.items"
            :key="group.id"
            :tab="group.label"
          >
            <a-form-item
              :label="entry.label"
              :required="entry.required"
              v-for="entry in group.entries"
            >
              <component
                :is="getCustomComponent(entry).component"
                :entry="entry"
                :bpmn-element="formData"
                v-model:value="formData[entry.id]"
                v-bind="getCustomComponent(entry).options || {}"
              />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-drawer>
  </div>
</template>
<style scoped>
.canvas {
  height: 100%;
}

.ant-tabs {
  width: 100%;
}

.icon-layout {
  cursor: pointer;
  font-size: larger;
}
</style>
