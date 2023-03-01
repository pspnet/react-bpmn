import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import BPMNModdle, { BaseElement, Process } from "bpmn-moddle";
import { defaultDefinitions } from "./index";
import { getBpmnId } from "extension/src/util";
import { moddle } from "./index";

import { ref } from "vue";

function getTypeName(node: NodeConfig): string {
  const name: string = node.type.replace("bpmn:", "").replace("bpmn2:", "");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getElement() {
  //@ts-ignore
  const rootElement = defaultDefinitions();
  const { rootElements, diagrams } = rootElement;
  const progress = rootElements.find(element => element.$type === "bpmn:Process") as Process;
  //@ts-ignore
  const flowElements = progress.get("flowElements");

  //TODO:
  //@ts-ignore
  const plane = diagrams[0].plane;
  const planeElement = plane.get("planeElement");
  return {
    rootElement,
    rootElements,
    progress,
    flowElements,
    diagrams,
    plane,
    planeElement,
  };
}

function createElement(nodeConfig: NodeConfig, lf: LogicFlow) {
  const typeName = getTypeName(nodeConfig);
  const id = nodeConfig.id || `${typeName}_${getBpmnId()}`;
  const name = typeof nodeConfig.text === "string" ? nodeConfig.text : nodeConfig.text?.value;
  const element = moddle.create(`bpmn:${typeName}`, {
    id,
    name,
    ...nodeConfig.properties,
    width: undefined,
    height: undefined,
  });
  if (!nodeConfig.x) return { element };
  const nodeModel = lf.getNodeModelById(id);
  const shape = moddle.create("bpmndi:BPMNShape", {
    id: `_BPMNShape_${id}`,
    bpmnElement: element,
    bounds: moddle.create("dc:Bounds", {
      x: nodeConfig.x - nodeModel.width / 2,
      y: nodeConfig.y - nodeModel.height / 2,
      width: nodeModel.width,
      height: nodeModel.height,
    }),
  });
  return { element, shape };
}

function createEdge(edgeConfig: EdgeConfig, flowElements: BaseElement[], lf: LogicFlow) {
  const { sourceNodeId, targetNodeId, text } = edgeConfig;
  const id = edgeConfig.id || `FLOW_${getBpmnId()}`;
  const name: string =
    (typeof text === "string" ? text : text?.value) || (edgeConfig.properties?.name as string);
  const sourceRef = flowElements.find(element => element.id === sourceNodeId);
  const targetRef = flowElements.find(element => element.id === targetNodeId);
  const element = moddle.create("bpmn:SequenceFlow", {
    id,
    name,
    sourceRef,
    targetRef,
  });

  const edgeModel = lf.getEdgeModelById(id);
  const textPosition = edgeModel.getTextPosition();
  const textStyle = edgeModel.getTextStyle();
  const label =
    textPosition.x && textPosition.y
      ? moddle.create("bpmndi:BPMNLabel", {
          bounds: moddle.create("dc:Bounds", {
            x: textPosition.x,
            y: textPosition.y,
            width: textStyle.textWidth || 20,
            height: textStyle.fontSize ? textStyle.fontSize + 2 : 16,
          }),
        })
      : undefined;
  const waypoint = edgeModel.pointsList?.length
    ? edgeModel.pointsList.map(point => {
        return moddle.create("dc:Point", { x: point.x, y: point.y });
      })
    : undefined;

  const shape = moddle.create("bpmndi:BPMNEdge", {
    id: `${id}_di`,
    bpmnElement: element,
    label,
    waypoint,
  });
  return { element, shape };
}

const adapterOut = (lf: LogicFlow) => {
  return (data: GraphConfigData): BPMNModdle.Definitions => {
    const { nodes, edges } = data;
    const { flowElements, planeElement, rootElement } = getElement();
    nodes.forEach(node => {
      const { element, shape } = createElement(node, lf);
      if (element) flowElements.push(element);
      if (shape) planeElement.push(shape);
    });
    edges.forEach(edge => {
      const { element, shape } = createEdge(edge, flowElements, lf);
      if (element) flowElements.push(element);
      if (shape) planeElement.push(shape);
    });
    return ref(rootElement);
  };
};

export default adapterOut;
