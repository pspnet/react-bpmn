import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import { getBpmnId } from "extension/src/util";

import BpmnModdle from "bpmn-moddle";
import type { BaseElement, Moddle, Process } from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

import xml from "../assets/test";
import sample from "../assets/sample";

class DataAdapter {
  private lf: LogicFlow;
  readonly graphData: GraphConfigData;
  private moddle: Moddle;

  constructor(lf: LogicFlow) {
    this.lf = lf;
    this.graphData = lf.getGraphData();
    this.moddle = new BpmnModdle({ camunda: camundaModdle });
  }

  getTypeName(node: NodeConfig): string {
    const name: string = node.type.replace("bpmn:", "").replace("bpmn2:", "");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  async getElement() {
    //@ts-ignore
    const { rootElement, elementsById, references } = await this.moddle.fromXML(xml);
    const rootElements: BaseElement[] = rootElement.get("rootElements");
    const progress = rootElements.find(element => element.$type === "bpmn:Process") as Process;
    //@ts-ignore
    const flowElements = progress.get("flowElements");

    const diagrams = rootElement.diagrams;
    const plane = diagrams[0].plane;
    const planeElement = plane.get("planeElement");
    return {
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
  }

  createElement(nodeConfig: NodeConfig) {
    const typeName = this.getTypeName(nodeConfig);
    const id = nodeConfig.id || `${typeName}_${getBpmnId()}`;
    const name = typeof nodeConfig.text === "string" ? nodeConfig.text : nodeConfig.text?.value;
    const element = this.moddle.create(`bpmn:${typeName}`, {
      id,
      name,
      ...nodeConfig.properties,
      width: undefined,
      height: undefined,
    });
    if (!nodeConfig.x) return { element };
    const nodeModel = this.lf.getNodeModelById(id);
    const shape = this.moddle.create("bpmndi:BPMNShape", {
      id: `_BPMNShape_${id}`,
      bpmnElement: element,
      bounds: this.moddle.create("dc:Bounds", {
        x: nodeConfig.x - nodeModel.width / 2,
        y: nodeConfig.y - nodeModel.height / 2,
        width: nodeModel.width,
        height: nodeModel.height,
      }),
    });
    return { element, shape };
  }

  createEdge(edgeConfig: EdgeConfig, flowElements: BaseElement[]) {
    const { sourceNodeId, targetNodeId, text } = edgeConfig;
    const id = edgeConfig.id || `FLOW_${getBpmnId()}`;
    const name: string =
      (typeof text === "string" ? text : text?.value) || (edgeConfig.properties?.name as string);
    const sourceRef = flowElements.find(element => element.id === sourceNodeId);
    const targetRef = flowElements.find(element => element.id === targetNodeId);
    const element = this.moddle.create("bpmn:SequenceFlow", {
      id,
      name,
      sourceRef,
      targetRef,
    });

    const edgeModel = this.lf.getEdgeModelById(id);
    const textPosition = edgeModel.getTextPosition();
    const textStyle = edgeModel.getTextStyle();
    const s = edgeModel.getTextStyle();
    const label =
      textPosition.x && textPosition.y
        ? this.moddle.create("bpmndi:BPMNLabel", {
            bounds: this.moddle.create("dc:Bounds", {
              x: textPosition.x,
              y: textPosition.y,
              width: textStyle.textWidth || 20,
              height: textStyle.fontSize ? textStyle.fontSize + 2 : 16,
            }),
          })
        : undefined;
    const waypoint = edgeModel.pointsList?.length
      ? edgeModel.pointsList.map(point => {
          return this.moddle.create("dc:Point", { x: point.x, y: point.y });
        })
      : undefined;

    const shape = this.moddle.create("bpmndi:BPMNEdge", {
      id: `${id}_di`,
      bpmnElement: element,
      label,
      waypoint,
    });
    return { element, shape };
  }

  async configToModdle() {
    const { references, elementsById, flowElements, planeElement, rootElement } =
      await this.getElement();
    const { nodes, edges } = this.graphData;
    nodes.forEach(node => {
      const { element, shape } = this.createElement(node);
      flowElements.push(element);
      planeElement.push(shape);
    });
    edges.forEach(edge => {
      const { element, shape } = this.createEdge(edge, flowElements);
      flowElements.push(element);
      planeElement.push(shape);
    });
    return rootElement;
  }

  async configToXML(format: boolean = true) {
    const rootElement = await this.configToModdle();
    //@ts-ignore
    const xmlEntity = await this.moddle.toXML(rootElement, { format });
    return xmlEntity;
  }
}

export default DataAdapter;
