import type { RepositoryClient } from './types'

function notImplemented(): never {
  throw new Error('Supabase adapter 尚未实现，请先完成第十四阶段后端接入。')
}

export const supabaseAdapterStub: RepositoryClient = {
  events: {
    getEventTemplates: async () => notImplemented(),
    getCurrentEventId: async () => notImplemented(),
    setCurrentEventId: async () => notImplemented(),
  },
  registrations: {
    getRegistrations: async () => notImplemented(),
    getRegistrationsByEventId: async () => notImplemented(),
    getRegistrationById: async () => notImplemented(),
    createRegistration: async () => notImplemented(),
    updateRegistration: async () => notImplemented(),
    deleteRegistration: async () => notImplemented(),
    resetRegistrations: async () => notImplemented(),
  },
  reviews: {
    approveRegistration: async () => notImplemented(),
    rejectRegistration: async () => notImplemented(),
    markRegistrationAsRegistered: async () => notImplemented(),
    appendAuditLog: async () => notImplemented(),
  },
  checkin: {
    checkInRegistration: async () => notImplemented(),
    markRegistrationDeparted: async () => notImplemented(),
  },
  checkpoints: {
    initializeCheckpointProgress: async () => notImplemented(),
    markCheckpointArrived: async () => notImplemented(),
    submitCheckpointTask: async () => notImplemented(),
    approveCheckpointTask: async () => notImplemented(),
    markRegistrationAttentionNeeded: async () => notImplemented(),
    clearRegistrationAttention: async () => notImplemented(),
    markRegistrationFinished: async () => notImplemented(),
  },
  announcements: {
    getAnnouncements: async () => notImplemented(),
    getAnnouncementsByEventId: async () => notImplemented(),
    createAnnouncement: async () => notImplemented(),
    updateAnnouncement: async () => notImplemented(),
    publishAnnouncement: async () => notImplemented(),
    deleteDraftAnnouncement: async () => notImplemented(),
    confirmAnnouncementRead: async () => notImplemented(),
    resetAnnouncements: async () => notImplemented(),
  },
  demo: {
    resetAllDemoData: async () => notImplemented(),
    seedCompleteDemoScenario: async () => notImplemented(),
    getDemoScenarioSummary: async () => notImplemented(),
  },
}
