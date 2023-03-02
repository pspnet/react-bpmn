import LogicFlow from "@logicflow/core";
import { defaultDefinitions, moddle } from "./index";

import { BPMNModdle, Definitions, FlowElement, Process } from "bpmn-moddle";
import { CustomPlanElement } from "../types";

class CustomModdle {
  lf: LogicFlow;
  moddle: BPMNModdle;
  private definitions: Definitions;

  constructor(lf: LogicFlow, definitions?: Definitions) {
    this.lf = lf;
    this.moddle = moddle;
    this.definitions = definitions || defaultDefinitions();
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
}

export default CustomModdle;
