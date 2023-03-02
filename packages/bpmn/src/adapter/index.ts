import adapterIn from "./adapterIn";
import adapterOut from "./adapterOut";
import CustomModdle from "./customModdle";
import LogicFlow from "@logicflow/core";
import BpmnModdle from "bpmn-moddle";

import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

const moddle = new BpmnModdle({ camunda: camundaModdle });

class CustomAdapter extends CustomModdle {
  constructor(lf: LogicFlow) {
    super(lf);
  }

  input() {
    return adapterIn();
  }

  output() {
    return adapterOut(this);
  }
}

export { moddle, CustomAdapter };
