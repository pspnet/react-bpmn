export default `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0f1z4wf" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.11.1" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.15.0">
  <bpmn:process id="Process_1sc8phk" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1sc8phk" name="节点1" />
    <bpmn:userTask id="UserTask_0to9qv1" name="节点2" />
    <bpmn:sequenceFlow id="FLOW_3aed1n8" name="连线连线连线" sourceRef="StartEvent_1sc8phk" targetRef="UserTask_0to9qv1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1sc8phk">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1sc8phk" bpmnElement="StartEvent_1sc8phk">
        <dc:Bounds x="142" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_UserTask_0to9qv1" bpmnElement="UserTask_0to9qv1">
        <dc:Bounds x="310" y="160" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="FLOW_3aed1n8_di" bpmnElement="FLOW_3aed1n8">
        <di:waypoint x="178" y="100" />
        <di:waypoint x="280" y="100" />
        <di:waypoint x="280" y="200" />
        <di:waypoint x="310" y="200" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="229" y="100" width="100" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
