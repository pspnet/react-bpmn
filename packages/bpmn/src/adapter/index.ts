import DataAdapterIn from "./load";
import DataAdapterOut from "./save";
import adapterIn from "./adapterIn";
import adapterOut from "./adapterOut";
import BpmnModdle from "bpmn-moddle";
import camundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

const moddle = new BpmnModdle({ camunda: camundaModdle });

export { moddle, adapterIn, adapterOut, DataAdapterOut, DataAdapterIn };
