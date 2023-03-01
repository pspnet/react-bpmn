import adapterIn from "./adapterIn";
import adapterOut from "./adapterOut";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import BpmnModdle from "bpmn-moddle";
import type BPMNModdle from "bpmn-moddle";

import { getBpmnId } from "@logicflow/extension/es/bpmn/getBpmnId";

const moddle = new BpmnModdle({ camunda: camundaModdle });

const defaultDefinitions = (): BPMNModdle.Definitions => {
  const process: BPMNModdle.Process = moddle.create("bpmn:Process", {
    id: `Process_${getBpmnId()}`,
    isExecutable: true,
  });
  const diagram: BPMNModdle.Diagram = moddle.create("bpmndi:BPMNDiagram", {
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
};

export { moddle, defaultDefinitions, adapterIn, adapterOut };
