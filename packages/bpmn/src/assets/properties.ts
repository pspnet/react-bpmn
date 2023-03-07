import {OptionListProps} from "ant-design-vue/es/vc-select/OptionList";


export interface ElementAttribute {
    id: string;
    label: string;
    items: GroupAttribute[]
}

export interface GroupAttribute {
    id: string;
    label: string;
    entries: EntryAttribute[]
}

export interface EntryAttribute {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    value?: any;
    component?: [any] | [any, Record<string, any>];
}

import {markRaw} from "vue";
import {Input} from "ant-design-vue";
import CustomDocumentInput from "../components/form/CustomDocumentInput.vue";
import {DefaultOptionType} from "ant-design-vue/lib/vc-select/Select";
import CustomSwitch from "../components/form/CustomSwitch.vue";
import CustomPropertyItem from "../components/form/CustomPropertyItem.vue";

const documentation: EntryAttribute = {
    id: "documentation",
    label: "文档",
    type: "bpmn:Documentation",
    component: [markRaw(CustomDocumentInput)],
};

const extensionElements: EntryAttribute = {
    id: "extensionElements",
    label: "自定义属性",
    type: "bpmn:ExtensionElements",
    component: [markRaw(CustomPropertyItem)],
};

const options: DefaultOptionType[] = [
    {label: "是", value: "true"},
    {label: "否", value: "false"},
];

const id: EntryAttribute = {
    id: "id",
    label: "ID",
};

const name: EntryAttribute = {
    id: "name",
    label: "名称",
};

const createGeneralGroup = (entries: EntryAttribute[] = []): GroupAttribute => {
    return {
        id: "general",
        label: "属性",
        entries: [id, name, ...entries]
    }
}

const createExtensionGroup = (entries: EntryAttribute[] = []): GroupAttribute => {
    return {
        id: "extension",
        label: "扩展",
        entries: [...entries]
    }
}

const createEventGroup = (entries: EntryAttribute[] = []): GroupAttribute => {
    return {
        id: "listener",
        label: "事件",
        entries: []
    }
}

const elements: ElementAttribute[] = [
    {
        id: "bpmn:definitions",
        label: "",
        items: [createGeneralGroup([
            {
                id: "targetNamespace",
                label: "命名空间"
            }
        ])]
    }, {
        id: "bpmn:process",
        label: "流程",
        items: [createGeneralGroup([
            {
                id: "isExecutable",
                label: "可执行",
                component: [markRaw(CustomSwitch)]
            },
            {
                id: "versionTag",
                label: "版本标签"
            },
            documentation
        ])]
    }, {
        id: "bpmn:sequenceFlow",
        label: "顺序流",
        items: [
            createGeneralGroup([
                {id: "conditionExpression", label: "条件", type: "Condition"},
                documentation
            ])
        ]
    }, {
        id: "bpmn:startEvent",
        label: "开始事件",
        items: [
            createGeneralGroup([
                {
                    id: "initiator",
                    label: "创建者",
                },
            ])
        ]
    }, {
        id: "bpmn:endEvent",
        label: "结束事件",
        items: [
            createGeneralGroup()
        ]
    }, {
        id: "bpmn:userTask",
        label: "用户任务",
        items: [
            createGeneralGroup([
                {id: "assignee", label: "受理人"},
                {id: "candidateUsers", label: "候选用户"},
                {id: "candidateGroups", label: "候选组"},
                {id: "priority", label: "优先级"},
                documentation
            ]),
            createExtensionGroup([
                {id: "extensionElements", label:"",component: [CustomPropertyItem]}
            ]),
            createEventGroup()
        ]
    }, {
        id: "bpmn:serviceTask",
        label: "系统任务",
        items: [
            createGeneralGroup([documentation]),
            createExtensionGroup(),
            createEventGroup()
        ]
    }, {
        id: "bpmn:exclusiveGateway",
        label: "排他网关",
        items: [createGeneralGroup()]
    }
]

const elementsByType: { [key: string]: ElementAttribute } = Object.fromEntries(elements.map(element => [element.id, element]));

export {elements, elementsByType, createGeneralGroup, createEventGroup, createExtensionGroup};
