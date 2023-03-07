<script setup lang="ts">
import BpmnModdle, { BaseElement, ExtensionElements } from "bpmn-moddle";
import { Form } from "ant-design-vue";
import { PlusOutlined, MinusOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { EntryAttribute } from "../../assets/properties";
import { moddle } from "../../adapter";
import { computed, ref, watch } from "vue";

interface ExtensionElementProps {
  value: any;
  entry: EntryAttribute;
}

interface KeyValueProps {
  name: string;
  value: string;
}

const props = withDefaults(defineProps<ExtensionElementProps>(), {
  value: moddle.create("bpmn:ExtensionElements", {
    values: [moddle.create("camunda:Properties", { values: [] })],
    valueRef: undefined,
  }),
});
console.log(123, props.value.values[0]);
const values = computed(() => props.value.values[0].values);

const emit = defineEmits<{ (event: "update:value", bpmnElement: ExtensionElements): void }>();

const keyValueList = ref<KeyValueProps[]>([{ name: "", value: "" }]);

const computedKeys = computed(() => keyValueList.value.map(item => item.name));

const formItemContext = Form.useInjectFormItemContext();
const onChange = (data: ExtensionElements) => {
  emit("update:value", data);
  formItemContext.onFieldChange();
};

const onSave = (data: KeyValueProps[]) => {

  const computedValues = data.filter(item=>item.name.length && item.value.length);
  console.log("watch66666", computedValues);
  //TODO: validate form data: name,value not null; name is unique;
  if(computedValues.length)
  values.value.splice(0,values.value.length,...computedValues.map(item=>moddle.create("camunda:Property", item)));
  else
    values.value.splice(0,values.value.length);
  onChange(props.value);
};
const removeRow = (index: number) => {
  if( keyValueList.value.length>1)
  keyValueList.value.splice(index, 1);
};
const addRow = () => {
  keyValueList.value.push({ name: "", value: "" });
};

const onKeyChange = (event: InputEvent, item: KeyValueProps, index: number) => {
  item.name = (event.target as HTMLInputElement).value.trim();
  if (!item.value.trim().length) return;
  keyValueList.value.splice(index, 1, item);
};

const onValueChange = (event: InputEvent, item: KeyValueProps, index: number) => {
  item.value = (event.target as HTMLInputElement).value.trim();
  if (!item.name.trim().length) return;
  keyValueList.value.splice(index, 1, item);
};

watch(keyValueList, values => {

  onSave(values)

},{deep:true});
</script>
<template>
  <div>
  <a-space class="row" v-for="(item, index) in keyValueList">
    <a-input-group compact>
      <a-input
        :value="item.name"
        allow-clear
        @change="onKeyChange($event, item, index)"
        style="width: 50%"
      />
      <a-input
        :value="item.value"
        @change="onValueChange($event, item, index)"
        allow-clear
        style="width: 50%"
      />
    </a-input-group>
    <a-space>
      <a-button type="link" @click="removeRow(index)">
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
  </div>
</template>
<style scoped>
.row {
  width: 100%;
}
</style>
