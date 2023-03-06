<script lang="ts">
import { PropType, ref } from "vue";
import { defineComponent, h } from "vue";
import { Form, Switch } from "ant-design-vue";
import { ElementPropertyAttribute } from "../../assets/properties";

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
    const checkedRef = ref<boolean>(Boolean(value));
    const onChange = (checked: boolean | string | number) => {
      emit("update:value", Boolean(checked));
      checkedRef.value = Boolean(checked);
      formItemContext.onFieldChange();
    };
    return () => h(Switch, { checked: checkedRef.value, onChange });
  },
});
</script>
