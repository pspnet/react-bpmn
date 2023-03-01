import adapterIn from "./adapterIn";
import adapterOut from "./adapterOut";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import BpmnModdle from "bpmn-moddle";
import type BPMNModdle from "bpmn-moddle";

import { getBpmnId } from "@logicflow/extension/es/bpmn/getBpmnId";
import { resultProps } from "ant-design-vue/lib/result";

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

const getElementMap = (
  moddleElement: Record<string, any>,
  result: Record<string, any> = {},
): Record<string, any> => {
  for (let key in moddleElement) {
    const value = moddleElement[key];
    if (key === "id" && value) {
      result[value] = moddleElement;
      continue;
    }
    if (key === "bpmnElement") continue;
    if (value instanceof Object) getElementMap(value, result);
    if (value instanceof Array) {
      for (let item of value) getElementMap(item, result);
    }
  }
  return result;
};

const findElementById = (moddleElement: Record<string, any>, id: string, result) => {
  if (moddleElement.id===id) return moddleElement;
    for (let key in moddleElement) {
      if (key === "bpmnElement") continue;
      const value = moddleElement[key];
      if (value instanceof Object) findElementById(value, id, result);
      else if (value instanceof Array) {
        for (let item of value) findElementById(item, id, result);
      } else continue;
    }
  
};

export { moddle, defaultDefinitions, getElementMap, findElementById, adapterIn, adapterOut };
