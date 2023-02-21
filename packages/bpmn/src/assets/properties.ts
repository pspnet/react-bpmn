export interface ElementPropertyAttribute {
    key: string;
    label: string;
    type?: string;
    required?: boolean;
    value?: any;
    component?: [any] | [any, Record<string, any>];
}

enum ElementType {
    DEFINITIONS = "bpmn:Definitions",
    PROGRESS = "bpmn:Progress",
    START_EVENT = "bpmn:StartEvent",
    END_EVENT = "bpmn:EndEvent",
    SEQUENCE_FLOW = "bpmn:SequenceFlow",
    EXCLUSIVE_GATE = "bpmn:ExclusiveGateway",
    USER_TASK = "bpmn:UserTask",
    SERVICE_TASK = "bpmn:ServiceTask"
}

export interface ElementAttribute {
    [key: string]: {
        title?: string;
        properties: ElementPropertyAttribute[]
    }
}

import {markRaw} from "vue";
import {Switch} from "ant-design-vue";

const documentation: ElementPropertyAttribute = {
    key: "documentation",
    label: "文档",
    type: "Documentation",
};

const elements: ElementAttribute = {
    "bpmn:Definitions": {
        properties: [
            {
                key: "targetNamespace",
                label: "命名空间",
                value: "https://www.activiti.org",
            },
        ],
    },
    "bpmn:StartEvent": {
        title: "开始",
        properties: [
            {
                key: "initiator",
                label: "创建者",
            },
        ],
    },
    "bpmn:Process": {
        title: "流程",
        properties: [
            {
                key: "isExecutable",
                label: "可执行文件",
                value: true,
                type: "Boolean",
                component: [markRaw(Switch)]
            },
            {
                key: "versionTag",
                label: "版本标签",
            },
            documentation,
        ],
    },

    "bpmn:SequenceFlow": {
        properties: [
            {key: "conditionExpression", label: "条件", type: "Condition"},
            documentation,
        ],
    },

    "bpmn:UserTask": {
        title: "用户任务",
        properties: [
            {key: "assignee", label: "受理人"},
            {key: "candidateUsers", label: "候选用户"},
            {key: "candidateGroups", label: "候选组"},
            {key: "priority", label: "优先级"},
            documentation,
        ],
    },

    "bpmn:ServiceTask": {
        title: "系统任务",
        properties: [documentation],
    },
    // "bpmn:task": {
    //   title: "任务",
    //   properties: [],
    // },
    "bpmn:ExclusiveGateway": {
        title: "排他网关",
        properties: [],
    },
    "bpmn:EndEvent": {
        title: "结束",
        properties: [],
    },
};

export default elements;