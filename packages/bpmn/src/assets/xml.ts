import { getBpmnId } from 'extension/src/main'

const id = getBpmnId()
export default `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_15uzrdy" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.11.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
  <bpmn:process id="Process_${id}" name="业务流程_${id}" isExecutable="true">
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_${id}">
    <bpmndi:BPMNPlane bpmnElement="Process_${id}" id="BPMNPlane_${id}">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`