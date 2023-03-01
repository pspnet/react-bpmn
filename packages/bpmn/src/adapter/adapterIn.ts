import { EdgeConfig, GraphConfigData, NodeConfig } from "@logicflow/core";
import BPMNModdle, { BaseElement } from "bpmn-moddle";
import properties from "../assets/properties";

function getTypeName(element: BaseElement): string {
  const name: string = element.$type.replace("bpmn:", "").replace("bpmn2:", "");
  return name.charAt(0).toLowerCase() + name.slice(1);
}

const adapterIn = () => {
  return (data: unknown): GraphConfigData => {
    const { rootElements, diagrams } = data as BPMNModdle.Definitions;
    console.log("rootElements", rootElements);
    const edges: EdgeConfig[] = [];
    const nodes: NodeConfig[] = [];
    const nodeMap: { [key: string]: NodeConfig } = {};

    for (let element of rootElements) {
      if (element.$type !== "bpmn:Process") break;
      // @ts-ignore
      const { flowElements } = element;
      if (!flowElements?.length) return { nodes, edges };
      const nodeElements = flowElements.filter(
        (item: BaseElement) =>
          (properties[item.$type] || properties[`bpmn:${getTypeName(item)}`])._type === "node",
      );
      for (let nodeElement of nodeElements) {
        // const descriptor = this.moddle.getElementDescriptor(nodeElement);
        const { $type, id, name, ...rest } = nodeElement;
        const node = {
          id,
          type: `bpmn:${getTypeName(nodeElement)}`,
          text: name,
          properties: { ...rest, _bpmnElement: nodeElement },
          x: 0,
          y: 0,
        };
        nodeMap[id] = node;
        nodes.push(node);
      }

      //edges
      //@ts-ignore
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
              type: "polyline",
              text: { value: name, x: bounds.x, y: bounds.y },
              sourceNodeId,
              targetNodeId,
              properties: { _bpmnElement: edgeElement },
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
    }
    return { nodes, edges };
  };
};

export default adapterIn;
