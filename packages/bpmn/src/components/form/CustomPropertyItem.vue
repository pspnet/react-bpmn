<script setup lang="ts">
import BpmnModdle, { ExtensionElements } from "bpmn-moddle";
import { Form } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";

const props = defineProps<{ value: ExtensionElements }>();
const emit = defineEmits<{ (event: "update:value", bpmnElement: ExtensionElements): void }>();

const formItemContext = Form.useInjectFormItemContext();
const onChange = (data: ExtensionElements) => {
  emit("update:value", data);
  formItemContext.onFieldChange();
};

const addRow = () => {};
</script>
<template>
  <a-space>
    <a-input-group compact>
      <a-select class="name">
        <a-select-option value="Zhejiang">Zhejiang</a-select-option>
        <a-select-option value="Jiangsu">Jiangsu</a-select-option>
      </a-select>
      <a-input style="width: 60%" />
    </a-input-group>
    <a-button type="link" @click="addRow">
      <template #icon>
        <PlusOutlined />
      </template>
    </a-button>
  </a-space>
</template>
<style scoped>
.name {
  width: 120px;
}
</style>
