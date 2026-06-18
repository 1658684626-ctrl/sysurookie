import {
  demoScript3Minutes,
  demoScript5Minutes,
} from '../utils/demo'
export type { DemoScenarioSummary } from '../utils/demo'
import { serviceClient } from './serviceClient'

export async function resetAllDemoData() {
  return serviceClient.demo.resetAllDemoData()
}

export async function seedCompleteDemoScenario() {
  return serviceClient.demo.seedCompleteDemoScenario()
}

export async function getDemoScenarioSummary() {
  return serviceClient.demo.getDemoScenarioSummary()
}

export function getDemoScripts() {
  return {
    demoScript3Minutes,
    demoScript5Minutes,
  }
}
