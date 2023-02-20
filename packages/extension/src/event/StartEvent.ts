import {CircleNode, CircleNodeModel, GraphModel} from '@logicflow/core';
import { getBpmnId } from '../util';
import {NodeConfig} from "@logicflow/core/types/type";

class StartEventModel extends CircleNodeModel {
    static extendKey = 'StartEventModel';
    constructor(data: NodeConfig, graphModel: GraphModel) {
        if (!data.id) {
            data.id = `Event_${getBpmnId()}`;
        }
        if (!data.text) {
            data.text = '';
        }
        if (data.text && typeof data.text === 'string') {
            data.text = {
                value: data.text,
                x: data.x,
                y: data.y + 40,
            };
        }
        // fix: 不能直接全部加，会导致下载后再次上传，位置错误。
        // data.text.y += 40;
        super(data, graphModel);
    }
    setAttributes(): void {
        this.r = 18;
    }
    getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
            message: '起始节点不能作为边的终点',
            validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
    }
}

class StartEventView extends CircleNode {
    static extendKey = 'StartEventNode';
}

const StartEvent = {
    type: 'bpmn:StartEvent',
    view: StartEventView,
    model: StartEventModel,
};

export { StartEventModel, StartEventView };
export default StartEvent;