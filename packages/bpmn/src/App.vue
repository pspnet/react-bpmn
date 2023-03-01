<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed, toRaw, watchEffect } from "vue";
import LogicFlow, { GraphModel } from "@logicflow/core";
import { Menu, DndPanel, SelectionSelect } from "@logicflow/extension";
import Bpmn from "extension/src/main";

import CustomToolbar from "./components/CustomToolbar.vue";
import CustomEditor from "./components/CustomEditor.vue";
import CustomFormItem from "./components/CustomFormItem.vue";

import { adapterIn, adapterOut } from "./adapter";

import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import patternItems from "./assets/panelItems";
import elementProperties, { ElementPropertyAttribute } from "./assets/properties";

import xml from "./assets/sample";
import BPMNModdle from "bpmn-moddle";
import { moddle } from "./adapter";
import properties from "./assets/properties";
import { Input } from "ant-design-vue";

const definitions = ref<BPMNModdle.Definitions>();

const canvasRef = ref<HTMLDivElement>();
const xmlVisibleRef = ref<boolean>(false);
const modalVisible = ref<boolean>(false);
const formData = ref<BPMNModdle.BPMNModdle>();
const currentElementProperties = ref<ElementPropertyAttribute[] | []>([]);

const lf = ref<LogicFlow>();
const graphData = computed(() => lf.value?.getGraphData());
// watch(graphData, value => {
//   console.log("watch graphData", value);
// });

const getProperties = (type: string) => {
  return properties[type];
};

const getCustomComponent = (item: ElementPropertyAttribute) => {
  const defaultAttributes = { allowClear: true };
  const defaultFormItem = [Input];
  const [component, options] = item?.component || defaultFormItem;
  return { component, options: { ...defaultAttributes, ...options } };
};
const toXML = () => {
  console.log(formData.value, definitions.value);
};

const triggerXmlView = async () => {
  //@ts-ignore
  const text = await moddle.toXML(definitions.value, { format: true });
  console.log(definitions.value, text);
  xmlContent.value = text.xml;
  xmlVisibleRef.value = !xmlVisibleRef.value;
};

const xmlContent = ref<string>();

onMounted(async () => {
  // @ts-ignore
  const { rootElement, elementsById } = await moddle.fromXML(xml);
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
    console.log("element:click", data, moddle.getElementDescriptor(data.properties._bpmnElement));
    currentElementProperties.value = [];
    // formData.value = data.properties._bpmnElement;
    formData.value = elementsById[data.id];
    if (data.type && elementProperties[data.type]?.properties) {
      currentElementProperties.value = elementProperties[data.type].properties;
    }
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.value.on("blank:click", data => {
    console.log("blank:click", data);
    if (!modalVisible.value) modalVisible.value = true;
  });
  lf.value.on("node:add,edge:add", data => {
    console.log("node:add,edge:add", data);
  });
  console.log(12311, elementsById);
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
  lf.value.render(definitions.value);
});
</script>
<template>
  <div class="container">
    <custom-toolbar @xml="triggerXmlView" />
    <custom-editor class="editor" v-show="xmlVisibleRef" :value="xmlContent" />
    <div class="designer" v-show="!xmlVisibleRef">
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
          <a-form-item>
            <a-button type="primary" @click="toXML">toXML</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
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

.container > .designer > .canvas {
  height: 100%;
}

.container > .designer:deep(.drawer) {
  position: absolute;
}
</style>
