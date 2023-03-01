<script setup lang="ts">
import { ref, inject, watch, onMounted, Ref, watchEffect } from "vue";

import { basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { xml } from "@codemirror/lang-xml";
import { lf as lfSymbol } from "../assets/symbol";
import LogicFlow from "@logicflow/core";
import { moddle } from "../adapter";

const languageConfig = new Compartment();

const inputRef = ref<HTMLDivElement>();

const editorView = ref<EditorView>();

const lf = inject<Ref<LogicFlow>>(lfSymbol);

const props = withDefaults(defineProps<{ visible: boolean }>(), { visible: false });

watch(
  () => props.visible,
  async value => {
    if (!value) return;
    const moddleElement = lf?.value?.getGraphData();
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
        const moddleElement = await moddle.fromXML(text);
        console.log("editor", text, moddleElement);
        // lf?.value.render(moddleElement);
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
