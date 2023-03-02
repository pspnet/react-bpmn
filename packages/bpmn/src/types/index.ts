import type { CustomAdapter } from "../adapter";
import type LogicFlow from "@logicflow/core";
import { Edge, Shape } from "bpmn-moddle";

export interface CustomLogicFlow extends LogicFlow {
  _adapter?: CustomAdapter;
}

export interface CustomEdge extends Edge {
  id: string;
}

export interface CustomShape extends Shape {
  id: string;
}

export type CustomPlanElement = CustomEdge | CustomShape;
