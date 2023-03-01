<script lang="ts">
import { defineComponent, h, PropType } from "vue";

import { Form, Input } from "ant-design-vue";
import { ElementPropertyAttribute } from "../assets/properties";
import BpmnModdle, { BaseElement } from "bpmn-moddle";
import { moddle } from "../adapter";

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
    bpmnElement: {
      type: Object as PropType<BaseElement>,
    },
  },
  emits: ["update:value"],
  setup({ item, bpmnElement, value }, { emit }) {
    console.log("document bpmn", bpmnElement, "item", item, "value", value);
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
