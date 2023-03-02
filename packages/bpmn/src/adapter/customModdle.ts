import LogicFlow from "@logicflow/core";
import { getBpmnId } from "@logicflow/extension/es/bpmn/getBpmnId";
import { moddle } from "./index";

import { BPMNModdle, Definitions, FlowElement, Process, Edge, Diagram, Shape } from "bpmn-moddle";
import { CustomPlanElement } from "../types";

class CustomModdle {
  lf: LogicFlow;
  moddle: BPMNModdle;
  private definitions: Definitions;

  constructor(lf: LogicFlow) {
    this.lf = lf;
    this.moddle = moddle;
    this.definitions = this.getDefaultDefinitions();
  }

  getProcess(): Process {
    const { rootElements } = this.definitions;
    return rootElements.find(element => element.$type === "bpmn:Process") as Process;
  }

  getFlowElements(): FlowElement[] {
    //@ts-ignore
    return this.getProcess().get("flowElements") || [];
  }

  getPlaneElements(): CustomPlanElement[] {
    const { diagrams } = this.definitions;
    //TODO:
    //@ts-ignore
    const plane = diagrams[0].plane;
    return plane.get("planeElement") || [];
  }

  getElements(): (FlowElement | CustomPlanElement)[] {
    const elements: (FlowElement | CustomPlanElement)[] = [];
    const flowElements = this.getFlowElements();
    const planeElements = this.getPlaneElements();
    flowElements.forEach(element => elements.push(element));
    planeElements.forEach(element => elements.push(element));
    return elements;
  }

  getFlowElementById(id: string) {
    return this.getFlowElements().find(element => element.id === id);
  }

  getPlanElementById(id: string) {
    return this.getPlaneElements().find(element => element.id === id);
  }

  getElementById(id: string) {
    const elements = this.getElements();
    return elements.find(element => element.id === id);
  }

  setFlowElement(id: string, element: FlowElement) {
    const flowElements = this.getFlowElements();
    const index = flowElements.findIndex(item => item.id === id);
    if (index < 0) flowElements.push(element);
    else flowElements[index] = element;
  }

  setEdgeElement(id: string, element: CustomPlanElement) {
    const planeElements = this.getPlaneElements();
    const index = planeElements.findIndex(item => item.id === id);
    if (index < 0) planeElements.push(element);
    else planeElements[index] = element;
  }

  setElement(id: string, element: FlowElement | CustomPlanElement) {
    if (["bpmndi:BPMNShape", "bpmndi:BPMNShape"].includes(element.$type))
      this.setEdgeElement(id, element);
    else this.setFlowElement(id, <FlowElement>element);
  }

  getDefinitions(): Definitions {
    return this.definitions;
  }

  setDefinitions(definitions: Definitions) {
    this.definitions = definitions;
  }

  private getDefaultDefinitions() {
    const process: Process = this.moddle.create("bpmn:Process", {
      id: `Process_${getBpmnId()}`,
      isExecutable: true,
    });
    const diagram: Diagram = this.moddle.create("bpmndi:BPMNDiagram", {
      id: `BPMNDiagram_${getBpmnId()}`,
      plane: this.moddle.create("bpmndi:BPMNPlane", { id: "BPMNPlane_1", bpmnElement: process }),
    });
    return this.moddle.create("bpmn:Definitions", {
      id: `Definitions_${getBpmnId()}`,
      targetNamespace: "http://bpmn.io/schema/bpmn",
      exporter: "Camunda Modeler",
      exporterVersion: "4.11.1",
      diagrams: [diagram],
      rootElements: [process],
    });
  }
}

export default CustomModdle;
