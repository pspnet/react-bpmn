export default `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0f1z4wf" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.11.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
  <bpmn:process id="Process_1sc8phk" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="节点1">
      <bpmn:outgoing>Flow_1kzy1hp</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="UserTask_2" name="节点2">
      <bpmn:incoming>Flow_1kzy1hp</bpmn:incoming>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_1kzy1hp" name="连线" sourceRef="StartEvent_1" targetRef="UserTask_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1sc8phk">
      <bpmndi:BPMNEdge id="Flow_1kzy1hp_di" bpmnElement="Flow_1kzy1hp">
        <di:waypoint x="196" y="118" />
        <di:waypoint x="278" y="118" />
        <di:waypoint x="278" y="240" />
        <di:waypoint x="360" y="240" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="282" y="153" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="160" y="100" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="164" y="136" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_UserTask_2" bpmnElement="UserTask_2">
        <dc:Bounds x="360" y="200" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>

`;
