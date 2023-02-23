import LogicFlow, { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import BpmnModdle from "bpmn-moddle";
import type { BaseElement, Moddle, Process } from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import xml from "../assets/test";
import properties from "../assets/properties";

class DataAdapterIn {
  private lf: LogicFlow;
  readonly graphData: GraphConfigData;
  private moddle: Moddle;

  constructor(lf: LogicFlow) {
    this.lf = lf;
    this.graphData = lf.getGraphData();
    this.moddle = new BpmnModdle({ camunda: camundaModdle });
  }

  getTypeName(element: BaseElement): string {
    const name: string = element.$type.replace("bpmn:", "").replace("bpmn2:", "");
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

  async xmlToConfig(xml: string) {
    // @ts-ignore
    const { rootElement, elementsById } = await this.moddle.fromXML(xml);
    const { rootElements, diagrams } = rootElement;

    //nodes
    const nodes: NodeConfig[] = [];
    const nodeMap: { [key: string]: NodeConfig } = {};
    for (let element of rootElements) {
      if (element.$type !== "bpmn:Process") break;
      const { flowElements } = element;
      const nodeElements = flowElements.filter(
        (item: BaseElement) =>
          (properties[item.$type] || properties[`bpmn:${this.getTypeName(item)}`])._type === "node",
      );
      for (let nodeElement of nodeElements) {
        // const descriptor = this.moddle.getElementDescriptor(nodeElement);
        const { $type, id, name, ...rest } = nodeElement;
        const node = {
          id,
          type: `bpmn:${this.getTypeName(nodeElement)}`,
          text: name,
          properties: rest,
          x: 0,
          y: 0,
        };
        nodeMap[id] = node;
        nodes.push(node);
      }

      //edges
      const edges: EdgeConfig[] = [];
      for (let diagram of diagrams) {
        const { plane } = diagram;
        const { planeElement } = plane;
        for (let edgeElement of planeElement) {
          if (edgeElement.$type === "bpmndi:BPMNEdge") {
            const { label, waypoint, bpmnElement } = edgeElement;
            const { id, name, sourceRef, targetRef } = bpmnElement;
            const { bounds } = label;
            const sourceNodeId = sourceRef.id;
            const targetNodeId = targetRef.id;
            const edge = {
              id,
              text: { value: name, x: bounds.x, y: bounds.y },
              sourceNodeId,
              targetNodeId,
              properties: {},
            };
            edges.push(edge);
          }
          if (edgeElement.$type === "bpmndi:BPMNShape") {
            const { bounds, bpmnElement } = edgeElement;
            const { x, y, width, height } = bounds;
            const { id } = bpmnElement;
            const targetElement = nodeMap[id];
            targetElement.x = x + width / 2;
            targetElement.y = y + height / 2;
          }
        }
      }
      return { nodes, edges };
    }
  }
}

export default DataAdapterIn;
