import { eventTemplates } from '../../data/eventTemplates'
import * as demoStorage from '../../utils/demo'
import * as storage from '../../utils/storage'
import type { RepositoryClient } from './types'

function toServiceError(error: unknown, action: string): Error {
  if (error instanceof Error) {
    return new Error(`${action}失败：${error.message}`)
  }

  return new Error(`${action}失败，请重试。`)
}

async function runStorageAction<T>(action: string, callback: () => T): Promise<T> {
  try {
    return callback()
  } catch (error) {
    throw toServiceError(error, action)
  }
}

export const localStorageAdapter: RepositoryClient = {
  events: {
    getEventTemplates: () =>
      runStorageAction('读取赛事模板', () => eventTemplates),
    getCurrentEventId: () =>
      runStorageAction('读取当前赛事', storage.getCurrentEventId),
    setCurrentEventId: (eventId) =>
      runStorageAction('切换当前赛事', () => storage.setCurrentEventId(eventId)),
  },
  registrations: {
    getRegistrations: () =>
      runStorageAction('读取报名数据', storage.getStoredRegistrations),
    getRegistrationsByEventId: (eventId) =>
      runStorageAction('读取赛事报名数据', () =>
        storage.getRegistrationsByEventId(eventId),
      ),
    getRegistrationById: (registrationId) =>
      runStorageAction('读取报名详情', () =>
        storage.getRegistrationById(registrationId),
      ),
    createRegistration: (input) =>
      runStorageAction('创建报名', () => storage.createRegistration(input)),
    updateRegistration: (registration) =>
      runStorageAction('更新报名', () => storage.updateRegistration(registration)),
    deleteRegistration: (registrationId) =>
      runStorageAction('删除报名', () => storage.deleteRegistration(registrationId)),
    resetRegistrations: () =>
      runStorageAction('重置报名数据', storage.resetDemoData),
  },
  reviews: {
    approveRegistration: (registrationId) =>
      runStorageAction('审核通过', () => storage.approveRegistration(registrationId)),
    rejectRegistration: (registrationId, reason) =>
      runStorageAction('驳回报名', () =>
        storage.rejectRegistration(registrationId, reason),
      ),
    markRegistrationAsRegistered: (registrationId) =>
      runStorageAction('确认为正式报名', () =>
        storage.markRegistrationAsRegistered(registrationId),
      ),
    appendAuditLog: (registrationId, auditLog) =>
      runStorageAction('追加操作记录', () =>
        storage.appendAuditLog(registrationId, auditLog),
      ),
  },
  checkin: {
    checkInRegistration: (registrationId) =>
      runStorageAction('检录签到', () => storage.checkInRegistration(registrationId)),
    markRegistrationDeparted: (registrationId) =>
      runStorageAction('标记出发', () =>
        storage.markRegistrationDeparted(registrationId),
      ),
  },
  checkpoints: {
    initializeCheckpointProgress: (registrationId) =>
      runStorageAction('初始化点位进度', () =>
        storage.initializeCheckpointProgress(registrationId),
      ),
    markCheckpointArrived: (registrationId, checkpointId) =>
      runStorageAction('记录到达点位', () =>
        storage.markCheckpointArrived(registrationId, checkpointId),
      ),
    submitCheckpointTask: (registrationId, checkpointId, payload) =>
      runStorageAction('提交点位任务', () =>
        storage.submitCheckpointTask(registrationId, checkpointId, payload),
      ),
    approveCheckpointTask: (registrationId, checkpointId) =>
      runStorageAction('审核点位任务', () =>
        storage.approveCheckpointTask(registrationId, checkpointId),
      ),
    markRegistrationAttentionNeeded: (registrationId, reason) =>
      runStorageAction('标记异常关注', () =>
        storage.markRegistrationAttentionNeeded(registrationId, reason),
      ),
    clearRegistrationAttention: (registrationId, reason) =>
      runStorageAction('解除异常关注', () =>
        storage.clearRegistrationAttention(registrationId, reason),
      ),
    markRegistrationFinished: (registrationId) =>
      runStorageAction('标记完赛', () =>
        storage.markRegistrationFinished(registrationId),
      ),
  },
  announcements: {
    getAnnouncements: () =>
      runStorageAction('读取通知数据', storage.getStoredAnnouncements),
    getAnnouncementsByEventId: (eventId) =>
      runStorageAction('读取赛事通知', () =>
        storage.getAnnouncementsByEventId(eventId),
      ),
    createAnnouncement: (input) =>
      runStorageAction('创建通知', () => storage.createAnnouncement(input)),
    updateAnnouncement: (announcementId, patch) =>
      runStorageAction('更新通知', () =>
        storage.updateAnnouncement(announcementId, patch),
      ),
    publishAnnouncement: (announcementId) =>
      runStorageAction('发布通知', () => storage.publishAnnouncement(announcementId)),
    deleteDraftAnnouncement: (announcementId) =>
      runStorageAction('删除通知草稿', () =>
        storage.deleteDraftAnnouncement(announcementId),
      ),
    confirmAnnouncementRead: (announcementId, registrationId, confirmedBy) =>
      runStorageAction('确认通知已读', () =>
        storage.confirmAnnouncementRead(announcementId, registrationId, confirmedBy),
      ),
    resetAnnouncements: () =>
      runStorageAction('重置通知数据', storage.resetDemoAnnouncements),
  },
  demo: {
    resetAllDemoData: () =>
      runStorageAction('重置本地开发数据', demoStorage.resetAllDemoData),
    seedCompleteDemoScenario: () =>
      runStorageAction('生成本地开发样例', demoStorage.seedCompleteDemoScenario),
    getDemoScenarioSummary: () =>
      runStorageAction('读取本地开发数据摘要', demoStorage.getDemoScenarioSummary),
  },
}
