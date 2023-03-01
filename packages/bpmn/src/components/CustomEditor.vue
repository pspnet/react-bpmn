<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import { basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { xml } from "@codemirror/lang-xml";

const props = withDefaults(defineProps<{ value?: string }>(), { value: "" });

const languageConfig = new Compartment();

const inputRef = ref<HTMLDivElement>();

const editorView = ref<EditorView>();

watch(
  () => props.value,
  text => {
    editorView.value?.dispatch({
      changes: { from: 0, to: editorView.value.state.doc.length, insert: text },
    });
  },
);

onMounted(() => {
  const state = EditorState.create({
    extensions: [basicSetup, languageConfig.of(xml())],
    doc: props.value,
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
