import { defaultDefinitions, moddle } from "./index";

import { BPMNModdle, Definitions, FlowElement, Process } from "bpmn-moddle";
import { CustomPlanElement } from "../types";

const customModdle = (definitions: Definitions = defaultDefinitions()) => {
  return {
    getProcess(): Process {
      const { rootElements } = definitions;
      return rootElements.find(element => element.$type === "bpmn:Process") as Process;
    },

    getFlowElements(): FlowElement[] {
      //@ts-ignore
      return this.getProcess().get("flowElements") || [];
    },
    getPlaneElements(): CustomPlanElement[] {
      const { diagrams } = definitions;
      //TODO:
      //@ts-ignore
      const plane = diagrams[0].plane;
      return plane.get("planeElement") || [];
    },
    getElements(): (FlowElement | CustomPlanElement)[] {
      const elements: (FlowElement | CustomPlanElement)[] = [];
      const flowElements = this.getFlowElements();
      const planeElements = this.getPlaneElements();
      flowElements.forEach(element => elements.push(element));
      planeElements.forEach(element => elements.push(element));
      return elements;
    },
    getFlowElementById(id: string) {
      return this.getFlowElements().find(element => element.id === id);
    },

    getPlanElementById(id: string) {
      return this.getPlaneElements().find(element => element.id === id);
    },

    getElementById(id: string) {
      const elements = this.getElements();
      const process = this.getProcess();
      elements.push(process);
      return elements.find(element => element.id === id);
    },
    setFlowElement(id: string, element: FlowElement) {
      const flowElements = this.getFlowElements();
      const index = flowElements.findIndex(item => item.id === id);
      if (index < 0) flowElements.push(element);
      else flowElements[index] = element;
    },
    setEdgeElement(id: string, element: CustomPlanElement) {
      const planeElements = this.getPlaneElements();
      const index = planeElements.findIndex(item => item.id === id);
      if (index < 0) planeElements.push(element);
      else planeElements[index] = element;
    },
    setProcess(id: string, element: Process) {
      const rootElements = this.getDefinitions().rootElements;
      const index = rootElements.findIndex(item => item.id === id);
      if (index < 0) rootElements.push(element);
      else rootElements[index] = element;
    },
    setElement(id: string, element: FlowElement | CustomPlanElement | Process) {
      if (element.$type === "bpmn:Process") {
        this.setProcess(id, element as Process);
      } else if (["bpmndi:BPMNShape", "bpmndi:BPMNShape"].includes(element.$type))
        this.setEdgeElement(id, element);
      else this.setFlowElement(id, <FlowElement>element);
    },

    getDefinitions(): Definitions {
      return definitions;
    },
  };
};

export default customModdle;
