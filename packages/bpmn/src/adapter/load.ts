import LogicFlow, { GraphConfigData } from "@logicflow/core";
import BpmnModdle, { Moddle } from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";
import xml from "../assets/test";
class DataAdapterIn {
  private lf: LogicFlow;
  readonly graphData: GraphConfigData;
  private moddle: Moddle;
  constructor(lf: LogicFlow) {
    this.lf = lf;
    this.graphData = lf.getGraphData();
    this.moddle = new BpmnModdle({ camunda: camundaModdle });
  }

  async xmlToConfig(xml: string) {
    // @ts-ignore
    const { rootElement, elementsById } = await this.moddle.fromXML(xml);
    console.log("xmlToConfig", rootElement, elementsById);
  }
}

export default DataAdapterIn;
