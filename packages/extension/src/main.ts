import LogicFlow from "@logicflow/core";
import ExclusiveGateway from "./gateway/ExclusiveGateway";
import SequenceFlow from "./flow/SequenceFlow";
import EndEvent from "./event/EndEvent";
import StartEvent from "./event/StartEvent";
import ServiceTask from "./task/ServiceTask";
import UserTask from "./task/UserTask";

class BpmnPlugin {
    static pluginName = 'bpmnPlugin';

    constructor({lf}: { lf: LogicFlow }) {
        lf.register(ExclusiveGateway);
        lf.register(EndEvent);
        lf.register(StartEvent);
        lf.register(ServiceTask);
        lf.register(UserTask);
        // 支持自定义bpmn元素的边
        if (!lf.options.customBpmnEdge) {
            lf.register(SequenceFlow);
            lf.setDefaultEdgeType('bpmn:sequenceFlow');
        }
    }

}

export {SequenceFlow, ExclusiveGateway}
export default BpmnPlugin;