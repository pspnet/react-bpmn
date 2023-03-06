import { Ref } from "vue";
import type { Definitions, Edge, Shape } from "bpmn-moddle";
import { GraphConfigData } from "@logicflow/core/types/type";
import LogicFlow from "@logicflow/core";

export interface DefinitionsXml {
  xml: string;
  _version?: number;
}

export interface CustomProps {
  lf: Ref<LogicFlow | undefined>;
  graphConfig: Ref<GraphConfigData | undefined>;
  bpmnElement: Ref<Definitions>;
  bpmnXml: Ref<DefinitionsXml>;
}

export interface CustomEdge extends Edge {
  id: string;
}

export interface CustomShape extends Shape {
  id: string;
}

export type CustomPlanElement = CustomEdge | CustomShape;
