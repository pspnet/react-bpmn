<script lang="ts">
import { defineComponent, h, PropType } from "vue";

import { Form, Input } from "ant-design-vue";
import { ElementPropertyAttribute } from "../../assets/properties";
import { moddle } from "../../adapter";

import type BpmnModdle from "bpmn-moddle";

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<Array<BpmnModdle.Documentation>>,
      default: () => [moddle.create("bpmn:Documentation", { text: "" })],
    },
    item: {
      type: Object as PropType<ElementPropertyAttribute>,
      required: true,
    },
  },
  emits: ["update:value"],
  setup({ item, value }, { emit }) {
    const formItemContext = Form.useInjectFormItemContext();
    const onChange = (data: any) => {
      const inputValue = (data.target as HTMLInputElement).value;
      value[0].text = inputValue;
      emit("update:value", value);
      formItemContext.onFieldChange();
    };
    return () => h(Input.TextArea, { onChange, defaultValue: value[0]?.text, ...{} });
  },
});
</script>
