<script setup lang="ts">
import { ref, inject, watch, onMounted } from "vue";

import { basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { xml } from "@codemirror/lang-xml";
import { props as propsSymbol } from "../assets/symbol";
import { CustomProps } from "../types";
import { moddle } from "../adapter";

const languageConfig = new Compartment();

const inputRef = ref<HTMLDivElement>();

const editorView = ref<EditorView>();

const pinia = inject<CustomProps>(propsSymbol)!;

const props = withDefaults(defineProps<{ visible: boolean }>(), { visible: false });

watch(
  () => props.visible,
  async value => {
    if (!value) return;
    console.log(90, pinia.bpmnElement.value, pinia.bpmnXml.value.xml);
    const text =
      //@ts-ignore
      pinia.bpmnXml.value.xml || "";
    editorView.value?.dispatch({
      changes: { from: 0, to: editorView.value.state.doc.length, insert: text },
    });
  },
);

onMounted(async () => {
  const state = EditorState.create({
    extensions: [
      basicSetup,
      languageConfig.of(xml()),
      EditorView.updateListener.of(async update => {
        const text = update.state.doc.toString();
        pinia.bpmnXml.value = { xml: text };
      }),
    ],
    doc: "",
  });
  editorView.value = new EditorView({
    state,
    parent: inputRef.value,
  });
});
</script>
<template>
  <div ref="inputRef" class="editor"></div>
</template>
<style>
.cm-editor {
  height: 100%;
}
</style>