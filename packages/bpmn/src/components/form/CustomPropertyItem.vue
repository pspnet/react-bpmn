<script setup lang="ts">
import BpmnModdle, { BaseElement, ExtensionElements } from "bpmn-moddle";
import { Form } from "ant-design-vue";
import { PlusOutlined, MinusOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { EntryAttribute } from "../../assets/properties";
import { moddle } from "../../adapter";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{ value: ExtensionElements; entry: EntryAttribute }>(), {
  value: moddle.create("bpmn:ExtensionElements", {
    values: [moddle.create("camunda:Properties", { values: [] })],
    valueRef: undefined,
  }),
});
console.log(123, props.value.values[0]);
const values: BaseElement[] = computed(() => props.value.values[0].values);

const emit = defineEmits<{ (event: "update:value", bpmnElement: ExtensionElements): void }>();

const formItemContext = Form.useInjectFormItemContext();
const onChange = (data: ExtensionElements) => {
  emit("update:value", data);
  formItemContext.onFieldChange();
};

const onSave = () => {
  //TODO: validate form data: name,value not null; name is unique;
  const property = moddle.create("camunda:Property", {
    name: keyValue.value,
    value: valueValue.value,
  });
  values.value.push(property);
  onChange(props.value);
};
const removeRow = () => {};
const addRow = () => {};

const keyValue = ref<string>();
const valueValue = ref<string>();
</script>
<template>
  <a-space class="row">
    <a-input-group compact>
      <a-input v-model:value="keyValue" allow-clear style="width: 50%" />
      <a-input v-model:value="valueValue" allow-clear style="width: 50%" />
    </a-input-group>
    <a-space>
      <a-button type="link" @click="onSave">
        <template #icon>
          <check-outlined />
        </template>
      </a-button>
      <a-button type="link" @click="removeRow">
        <template #icon>
          <minus-outlined />
        </template>
      </a-button>
      <a-button type="link" @click="addRow">
        <template #icon>
          <plus-outlined />
        </template>
      </a-button>
    </a-space>
  </a-space>
</template>
<style scoped>
.row {
  width: 100%;
}
</style>
