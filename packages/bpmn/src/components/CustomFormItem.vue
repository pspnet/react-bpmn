<script lang="ts">

import type {PropType} from 'vue'
import {defineComponent, h} from 'vue'
import {Form, Input} from "ant-design-vue"

import type {ElementPropertyAttribute} from "../assets/properties";

import xml from "../assets/sample.bpmn"

const defaultAttributes = {allowClear: true}
const defaultFormItem = [Input];
export default defineComponent({
  props: {
    value: {
      type: null,
      required: true
    },
    item: {
      type: Object as PropType<ElementPropertyAttribute>,
      required: true
    }
  },
  emits: ['update:value'],
  setup(props, {emit}) {
    const formItemContext = Form.useInjectFormItemContext();
    const onChange = (data: any) => {
      let value = data;
      if (data instanceof InputEvent)
        value = (data.target as HTMLInputElement).value;
      emit('update:value', value);
      formItemContext.onFieldChange();
    }
    const [component, options] = props.item?.component || defaultFormItem;
    console.log(12311, component, options);
    return () => h(component, {...defaultAttributes, onChange, ...(options || {})}, undefined);
  }
})
</script>