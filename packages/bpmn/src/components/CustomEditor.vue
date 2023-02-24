<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import { EditorState, Compartment } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";

import { xml } from "@codemirror/lang-xml";

const languageConf = new Compartment();

const inputRef = ref();
const value = ref<string>("<span>bbhb</span>");
watch(value, text => {
  console.log(123, text);
});
onMounted(() => {
  const state = EditorState.create({
    extensions: [basicSetup, languageConf.of(xml())],
    doc: value.value,
  });
  const view = new EditorView({
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
