import { serviceClient } from './serviceClient'

export async function getEventTemplates() {
  return serviceClient.events.getEventTemplates()
}

export async function getCurrentEventId() {
  return serviceClient.events.getCurrentEventId()
}

export async function setCurrentEventId(eventId: string) {
  return serviceClient.events.setCurrentEventId(eventId)
}

export async function getEventById(eventId: string) {
  const templates = await getEventTemplates()

  return templates.find((eventConfig) => eventConfig.id === eventId)
}

export async function getCurrentEvent() {
  const [templates, currentEventId] = await Promise.all([
    getEventTemplates(),
    getCurrentEventId(),
  ])

  return templates.find((eventConfig) => eventConfig.id === currentEventId) ?? templates[0]
}
