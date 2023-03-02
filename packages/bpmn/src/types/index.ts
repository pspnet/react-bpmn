import type { CustomAdapter } from "../adapter";
import type LogicFlow from "@logicflow/core";
import type { Definitions, Edge, Shape } from "bpmn-moddle";

export interface CustomLogicFlow {
  lf: LogicFlow | undefined;
  bpmnElement?: Definitions;
  _adapter?: CustomAdapter;
}

export interface CustomEdge extends Edge {
  id: string;
}

export interface CustomShape extends Shape {
  id: string;
}

export type CustomPlanElement = CustomEdge | CustomShape;
