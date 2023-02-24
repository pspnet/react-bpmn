<script setup lang="ts">
import {
  CodeOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
const emit = defineEmits(["xml", "upload", "download", "save"]);
</script>
<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="业务流程设计器" sub-title="">
    <template #extra>
      <a-button title="XML" @click="emit('xml')">
        <template #icon>
          <code-outlined />
        </template>
      </a-button>
      <a-button title="上传" @click="emit('upload')">
        <template #icon>
          <cloud-upload-outlined />
        </template>
      </a-button>
      <a-button title="下载" @click="emit('download')">
        <template #icon>
          <cloud-download-outlined />
        </template>
      </a-button>
      <a-button type="primary" title="保存" @click="emit('save')">
        <template #icon>
          <save-outlined />
        </template>
      </a-button>
    </template>
    <template #tags>
      <a-tag color="green">Beta</a-tag>
    </template>
  </a-page-header>
</template>
