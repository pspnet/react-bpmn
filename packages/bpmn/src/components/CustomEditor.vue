<script setup lang="ts">
import { ref, inject, watch, onMounted, Ref, watchEffect } from "vue";

import { basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { xml } from "@codemirror/lang-xml";
import { lf as lfSymbol } from "../assets/symbol";
import { moddle } from "../adapter";
import { CustomLogicFlow } from "../types";
import BPMNModdle from "bpmn-moddle";

const languageConfig = new Compartment();

const inputRef = ref<HTMLDivElement>();

const editorView = ref<EditorView>();

const pinia = inject<CustomLogicFlow>(lfSymbol);

const props = withDefaults(defineProps<{ visible: boolean }>(), { visible: false });

watch(
  () => props.visible,
  async value => {
    if (!value) {
      if (pinia) pinia.lf?.render(pinia.bpmnElement);
      return;
    }
    const moddleElement = pinia?.bpmnElement;
    //@ts-ignore
    const text = await moddle.toXML(moddleElement, { format: true });
    console.log("editor watch", editorView.value?.state, text);
    editorView.value?.dispatch({
      changes: { from: 0, to: editorView.value.state.doc.length, insert: text.xml || "" },
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
        //@ts-ignore
        const { rootElement } = await moddle.fromXML(text);
        if (pinia) pinia.bpmnElement = rootElement;
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
