import { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import { getBpmnId } from "extension/src/util";

import BpmnModdle from "bpmn-moddle";
import type { BaseElement, Moddle, Process } from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

import xml from "../assets/test";
import sample from "../assets/sample";

const moddle = new BpmnModdle({ camunda: camundaModdle });
const getElement = async () => {
  //@ts-ignore
  const { rootElement, elementsById, references } = await moddle.fromXML(xml);
  const rootElements: BaseElement[] = rootElement.get("rootElements");
  const progress = rootElements.find(element => element.$type === "bpmn:Process") as Process;
  //@ts-ignore
  const flowElements = progress.get("flowElements");

  const diagrams = rootElement.diagrams;
  const plane = diagrams[0].plane;
  const planeElement = plane.get("planeElement");
  return {
    moddle,
    references,
    elementsById,
    rootElement,
    rootElements,
    progress,
    flowElements,
    diagrams,
    plane,
    planeElement,
  };
};

const getTypeName = (node: NodeConfig) => {
  const name: string = node.type.replace("bpmn:", "").replace("bpmn2:", "");
  return name.charAt(0).toUpperCase() + name.slice(1);
};
const createElement = (nodeConfig: NodeConfig, moddle: Moddle) => {
  const typeName = getTypeName(nodeConfig);
  const id = nodeConfig.id || `${typeName}_${getBpmnId()}`;
  const element = moddle.create(`bpmn:${typeName}`, {
    id,
    name: nodeConfig.text,
    ...nodeConfig.properties,
    width: undefined,
    height: undefined,
  });
  if (!nodeConfig.x) return { element };
  const shape = moddle.create("bpmndi:BPMNShape", {
    id: `_BPMNShape_${id}`,
    bpmnElement: element,
    bounds: moddle.create("dc:Bounds", {
      x: nodeConfig.x,
      y: nodeConfig.y,
      width: nodeConfig.properties?.width,
      height: nodeConfig.properties?.height,
    }),
  });
  return { element, shape };
};

const createEdge = (edgeConfig: EdgeConfig, flowElements: BaseElement[], moddle: Moddle) => {
  const { sourceNodeId, targetNodeId, text } = edgeConfig;
  const id = `FLOW_${getBpmnId()}`;
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
  const isDraggableLabel = text instanceof Object && text.x && text.y;
  const label = isDraggableLabel
    ? moddle.create("bpmndi:BPMNLabel", {
        bounds: moddle.create("dc:Bounds", {
          x: text.x,
          y: text.y,
          width: name ? name.length * 10 : 20,
          height: 16,
        }),
      })
    : undefined;
  const waypoint = edgeConfig.pointsList?.length
    ? edgeConfig.pointsList.map(point => {
        return moddle.create("dc:Point", point);
      })
    : undefined;

  const shape = moddle.create("bpmndi:BPMNEdge", {
    id: `${id}_di`,
    bpmnElement: element,
    label,
    waypoint,
  });
  return { element, shape };
};

const configToModdle = async ({ edges, nodes }: GraphConfigData) => {
  const { moddle, references, elementsById, flowElements, planeElement, rootElement } =
    await getElement();
  nodes.forEach(node => {
    const { element, shape } = createElement(node, moddle);
    flowElements.push(element);
    planeElement.push(shape);
  });
  edges.forEach(edge => {
    const { element, shape } = createEdge(edge, flowElements, moddle);
    flowElements.push(element);
    planeElement.push(shape);
  });
  console.log("moddle", rootElement, elementsById, references);
  return rootElement;
};

const configToXML = async (config: GraphConfigData, format: boolean = true) => {
  const tt = await moddle.fromXML(sample);
  console.log(tt);
  const rootElement = await configToModdle(config);
  //@ts-ignore
  const xmlEntity = await moddle.toXML(rootElement, { format });
  return xmlEntity;
};

export { moddle, configToModdle, configToXML };
