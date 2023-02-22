import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

import { EdgeConfig } from "@logicflow/core/types/type";
import GraphModel from "@logicflow/core/types/model/GraphModel";

import { getBpmnId } from "../util";

class SequenceFlowModel extends PolylineEdgeModel {
  static extendKey = "SequenceFlowModel";

  constructor(data: EdgeConfig, graphModel: GraphModel) {
    if (!data.id) {
      data.id = `Flow_${getBpmnId()}`;
    }
    super(data, graphModel);
  }
}

class SequenceFlowView extends PolylineEdge {
  static extendKey = "SequenceFlowEdge";
}

export { SequenceFlowView, SequenceFlowModel };
export default {
  type: "bpmn:sequenceFlow",
  view: SequenceFlowView,
  model: SequenceFlowModel,
};
