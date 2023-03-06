<script lang="ts">
import { defineComponent, h, PropType } from "vue";

import { Form, Input } from "ant-design-vue";
import { moddle } from "../../adapter";

import type BpmnModdle from "bpmn-moddle";

const defaultAttributes = { allowClear: true };
export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Array<BpmnModdle.Documentation>>,
      default: () => [moddle.create("bpmn:Documentation", { text: "" })],
    },
  },
  emits: ["update:value"],
  setup({ value }, { emit }) {
    const formItemContext = Form.useInjectFormItemContext();
    const onChange = (data: any) => {
      const inputValue = (data.target as HTMLInputElement).value;
      value[0].text = inputValue;
      emit("update:value", value);
      formItemContext.onFieldChange();
    };
    return () =>
      h(Input.TextArea, { ...defaultAttributes, onChange, defaultValue: value[0]?.text, ...{} });
  },
});
</script>
