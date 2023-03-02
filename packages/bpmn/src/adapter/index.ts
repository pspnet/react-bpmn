import adapterIn from "./adapterIn";
import adapterOut from "./adapterOut";
import CustomModdle from "./customModdle";
import LogicFlow from "@logicflow/core";
import BpmnModdle, { Definitions, Diagram, Process } from "bpmn-moddle";

import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import { getBpmnId } from "@logicflow/extension/es/bpmn/getBpmnId";

const moddle = new BpmnModdle({ camunda: camundaModdle });

function defaultDefinitions() {
  const process: Process = moddle.create("bpmn:Process", {
    id: `Process_${getBpmnId()}`,
    isExecutable: true,
  });
  const diagram: Diagram = moddle.create("bpmndi:BPMNDiagram", {
    id: `BPMNDiagram_${getBpmnId()}`,
    plane: moddle.create("bpmndi:BPMNPlane", { id: "BPMNPlane_1", bpmnElement: process }),
  });
  return moddle.create("bpmn:Definitions", {
    id: `Definitions_${getBpmnId()}`,
    targetNamespace: "http://bpmn.io/schema/bpmn",
    exporter: "Camunda Modeler",
    exporterVersion: "4.11.1",
    diagrams: [diagram],
    rootElements: [process],
  });
}

class CustomAdapter extends CustomModdle {
  constructor(lf: LogicFlow, definitions?: Definitions) {
    super(lf, definitions);
  }

  input() {
    return adapterIn();
  }

  output() {
    return adapterOut(this);
  }
}

export { moddle, defaultDefinitions, CustomAdapter };
