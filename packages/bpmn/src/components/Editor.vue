<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

import { EditorState,Compartment} from "@codemirror/state";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";

import {  xml } from "@codemirror/lang-xml";
const languageConf = new Compartment();

const inputRef = ref();
const value = ref<string>("<span>bbhb</span>");
onMounted(()=>{
  let state = EditorState.create({
    extensions: [
      basicSetup,
      languageConf.of(xml()),

    ],
    // 编辑器中的内容
    doc: "<span>bbhb</span>",
  });
let view = new EditorView({
  state,
  // 编辑器 挂载的dom
  parent: inputRef.value,
});
})


</script>
<template>
   <div ref="inputRef"></div>
</template>
