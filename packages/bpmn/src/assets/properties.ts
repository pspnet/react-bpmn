import { OptionListProps } from "ant-design-vue/es/vc-select/OptionList";

export interface ElementPropertyAttribute {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: any;
  component?: [any] | [any, Record<string, any>];
}

export interface ElementAttribute {
  [key: string]: {
    title?: string;
    properties: ElementPropertyAttribute[];
  };
}

import { markRaw } from "vue";
import { Input, Select, Switch } from "ant-design-vue";
import CustomDocumentInput from "../components/form/CustomDocumentInput.vue";
import { DefaultOptionType } from "ant-design-vue/lib/vc-select/Select";
import CustomSwitch from "../components/form/CustomSwitch.vue";
import CustomPropertyItem from "../components/form/CustomPropertyItem.vue";

const documentation: ElementPropertyAttribute = {
  key: "documentation",
  label: "文档",
  type: "bpmn:Documentation",
  component: [markRaw(CustomDocumentInput)],
};

const extensionElements: ElementPropertyAttribute = {
  key: "extensionElements",
  label: "自定义属性",
  type: "bpmn:ExtensionElements",
  component: [markRaw(CustomPropertyItem)],
};

const options: DefaultOptionType[] = [
  { label: "是", value: "true" },
  { label: "否", value: "false" },
];

const id: ElementPropertyAttribute = {
  key: "id",
  label: "ID",
};

const name: ElementPropertyAttribute = {
  key: "name",
  label: "名称",
};

const elements: ElementAttribute = {
  "bpmn:definitions": {
    properties: [
      {
        key: "targetNamespace",
        label: "命名空间",
        value: "https://www.activiti.org",
      },
    ],
  },
  "bpmn:startEvent": {
    title: "开始",
    properties: [
      id,
      name,
      {
        key: "initiator",
        label: "创建者",
      },
    ],
  },
  "bpmn:process": {
    title: "流程",
    properties: [
      id,
      name,
      {
        key: "isExecutable",
        label: "可执行文件",
        type: "Boolean",
        component: [markRaw(CustomSwitch)],
      },
      {
        key: "versionTag",
        label: "版本标签",
      },
      documentation,
    ],
  },

  "bpmn:sequenceFlow": {
    properties: [
      id,
      name,
      { key: "conditionExpression", label: "条件", type: "Condition" },
      documentation,
    ],
  },

  "bpmn:userTask": {
    title: "用户任务",
    properties: [
      id,
      { ...name, component: [markRaw(Input), { required: true }] },
      { key: "assignee", label: "受理人" },
      { key: "candidateUsers", label: "候选用户" },
      { key: "candidateGroups", label: "候选组" },
      { key: "priority", label: "优先级" },
      documentation,
      extensionElements,
    ],
  },

  "bpmn:serviceTask": {
    title: "系统任务",
    properties: [id, name, documentation],
  },
  // "bpmn:task": {
  //   title: "任务",
  //   properties: [],
  // },
  "bpmn:exclusiveGateway": {
    title: "排他网关",
    properties: [id, name],
  },
  "bpmn:endEvent": {
    title: "结束",
    properties: [id, name],
  },
};

export default elements;
