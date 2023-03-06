<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, h } from "vue";
import { Form, Input } from "ant-design-vue";
import { ElementPropertyAttribute } from "../../assets/properties";

const defaultAttributes = { allowClear: true };
const defaultFormItem = [Input];
export default defineComponent({
  props: {
    value: {
      type: null,
      required: true,
    },
    item: {
      type: Object as PropType<ElementPropertyAttribute>,
      required: true,
    },
  },
  emits: ["update:value"],
  setup({ value, item }, { emit }) {
    const formItemContext = Form.useInjectFormItemContext();
    const onChange = (data: any) => {
      let computedData = data;
      if (data instanceof InputEvent) computedData = (data.target as HTMLInputElement).value;
      console.log(123, computedData);
      emit("update:value", computedData);
      formItemContext.onFieldChange();
    };
    const [component, options] = item.component || defaultFormItem;
    return () =>
      h(
        component,
        { ...defaultAttributes, defaultValue: value, onChange, ...(options || {}) },
        undefined,
      );
  },
});
</script>
