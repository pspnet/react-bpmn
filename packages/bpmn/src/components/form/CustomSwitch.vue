<script lang="ts">
import { PropType, ref } from "vue";
import { defineComponent, h } from "vue";
import { Form, Switch } from "ant-design-vue";

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:value"],
  setup({ value }, { emit }) {
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