import { GraphConfigData } from '@logicflow/core'
import { getBpmnId } from 'extension/src/util'

import BpmnModdle, { BaseElement, Process } from 'bpmn-moddle'
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json'

import xml from '../assets/test'

const moddle = new BpmnModdle({ camunda: camundaModdle })

const getElement = async () => {
  const { rootElement } = await moddle.fromXML(xml)
  const rootElements: BaseElement[] = rootElement.get('rootElements')
  const progress = rootElements.find(
    (element) => element.$type === 'bpmn:Process',
  ) as Process
  const flowElements = progress.get('flowElements')

  const diagrams = rootElement.diagrams
  const plane = diagrams[0].plane
  const planeElements = plane.get('planeElement')
  return {
    moddle,
    rootElement,
    rootElements,
    progress,
    flowElements,
    diagrams,
    plane,
    planeElements,
  }
}

const configToModdle = async ({ edges, nodes }: GraphConfigData) => {
  const { moddle, flowElements, planeElements } = await getElement()
}
