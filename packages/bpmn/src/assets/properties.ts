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
    _type?: "node" | "edge";
    title?: string;
    properties: ElementPropertyAttribute[];
  };
}

import { markRaw } from "vue";
import { Switch } from "ant-design-vue";

const documentation: ElementPropertyAttribute = {
  key: "documentation",
  label: "文档",
  type: "Documentation",
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
    _type: "node",
    title: "开始",
    properties: [
      {
        key: "initiator",
        label: "创建者",
      },
    ],
  },
  "bpmn:process": {
    title: "流程",
    properties: [
      {
        key: "isExecutable",
        label: "可执行文件",
        value: true,
        type: "Boolean",
        component: [markRaw(Switch)],
      },
      {
        key: "versionTag",
        label: "版本标签",
      },
      documentation,
    ],
  },

  "bpmn:sequenceFlow": {
    properties: [{ key: "conditionExpression", label: "条件", type: "Condition" }, documentation],
  },

  "bpmn:userTask": {
    _type: "node",
    title: "用户任务",
    properties: [
      { key: "assignee", label: "受理人" },
      { key: "candidateUsers", label: "候选用户" },
      { key: "candidateGroups", label: "候选组" },
      { key: "priority", label: "优先级" },
      documentation,
    ],
  },

  "bpmn:serviceTask": {
    title: "系统任务",
    properties: [documentation],
  },
  // "bpmn:task": {
  //   title: "任务",
  //   properties: [],
  // },
  "bpmn:exclusiveGateway": {
    title: "排他网关",
    properties: [],
  },
  "bpmn:endEvent": {
    title: "结束",
    properties: [],
  },
};

export default elements;
