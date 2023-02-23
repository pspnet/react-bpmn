<script setup lang="ts">
import {ref} from "vue"
  import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);

const value=ref<string>("pppoop");
</script>
<template>
<div contenteditable="true"><pre><code>{{ value }}</code>
</pre></div>
</template>