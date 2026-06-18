import { eventTemplates } from '../data/eventTemplates'
import { mockAnnouncements } from '../data/mockAnnouncements'
import { mockRegistrations } from '../data/mockRegistrations'
import {
  getStoredAnnouncements,
  getStoredRegistrations,
  resetDemoData,
  saveStoredAnnouncements,
  saveStoredRegistrations,
  setCurrentEventId,
} from './storage'
import { getAnnouncementReviewSummaries } from './analytics'
import { getDashboardSummary } from './statusFlow'

export interface DemoScenarioSummary {
  currentEventName: string
  totalRegistrations: number
  pendingReviewCount: number
  registeredCount: number
  checkedInCount: number
  inProgressCount: number
  finishedCount: number
  announcementCount: number
  unconfirmedAnnouncementCount: number
}

export const demoScript3Minutes = `大家好，我们的课程作业题目是赛事运营数字化解决方案，产品叫 EasyEvent 易赛通。

它是一个面向中小型体育赛事的一站式数字化管理系统。我们选择珠海城市鲁宾逊趣味定向赛作为首个应用案例，但系统不是为这一场比赛写死的，而是通过 EventConfig 赛事模板复用到校园跑步赛、篮球赛等不同赛事。

我们观察到，中小型赛事经常把报名、审核、签到、通知、点位和赛后复盘分散在问卷、微信群、Excel 和纸质表里。这样会带来三个问题：规则靠人工核对容易漏，现场队伍状态不透明，赛后数据也很难沉淀。

EasyEvent 的方案是把赛前、赛中、赛后串成一个状态闭环：赛事模板配置、报名组队、资料审核、正式报名、签到检录、点位打卡、通知确认，最后进入数据复盘。

当前 MVP 使用 React、TypeScript 和 Tailwind 实现，数据使用 mock data 和 localStorage，不接真实后端、登录、支付、地图或短信。这样做的重点是验证产品流程和课堂演示价值。

创新点在于，它不是普通报名表，而是把赛事运营的关键节点都用状态流连接起来；组织方能看到审核、签到、现场执行和通知确认，参赛者也知道自己下一步该做什么。最终数据复盘可以帮助下一届赛事优化规则、点位和现场配置。`

export const demoScript5Minutes = `大家好，我们的课程作业题目是赛事运营数字化解决方案。我们设计的产品叫 EasyEvent 易赛通，是一个面向中小型体育赛事的一站式数字化管理系统。

我们的首个应用案例是珠海城市鲁宾逊趣味定向赛。这个赛事有队伍报名、不同路线、成员身份、材料规则、现场检录、点位任务和安全通知，非常适合展示中小型赛事的运营复杂度。但 EasyEvent 并不是为珠海这一场赛事写死的，系统底层通过 EventConfig 配置赛事名称、报名模式、项目路线、成员字段、材料规则、签到方式、点位列表和通知类型，所以同一套系统也可以复用到校园 5km 跑步赛、校园篮球赛等场景。

我们要解决的痛点主要有四个。第一，工具分散，报名在问卷里，通知在微信群里，数据在 Excel 和纸质表里。第二，赛事规则复杂，不同项目的人数、材料和审核要求不同，人工核对容易漏判。第三，现场不可视，签到、出发、点位进度和异常情况往往依赖工作人员口头沟通。第四，赛后复盘困难，很多数据分散在不同工具和人的记忆里。

EasyEvent 的方案是建立一个完整运营闭环：赛事配置之后，参赛者可以报名或组队，填写成员资料；系统根据模板规则提示缺失项；管理端审核通过后确认为正式报名；现场工作人员完成签到检录并标记出发；参赛者进行点位打卡和任务提交；管理端审核点位任务、处理异常关注；组织方发布通知公告，参赛者确认已读；最后所有报名、审核、签到、点位和通知数据进入复盘看板。

从技术上看，当前 MVP 使用 Vite、React、TypeScript 和 Tailwind CSS。为了符合课程 MVP 范围，我们使用 mock data 和 localStorage 模拟数据持久化，不接真实后端、数据库、登录、支付、地图、GPS、短信或微信通知。真实上线时，可以扩展到云数据库、文件存储、小程序端、二维码签到和消息推送。

这个项目的创新点有三个。第一，它不是为单场赛事写死，而是通过赛事模板配置支持多赛事复用。第二，它不是普通报名表，而是覆盖赛前、赛中和赛后的状态闭环。第三，它用数据复盘沉淀运营经验，比如签到率、完赛率、点位任务积压、异常关注和通知确认率。

总结来说，EasyEvent 的价值是减少人工核对，提高现场执行可视性，降低漏审和漏通知，并帮助赛事组织方把一次活动的数据沉淀为下一届赛事优化依据。`

export function resetAllDemoData(): DemoScenarioSummary {
  resetDemoData()
  const eventConfig = getPrimaryDemoEvent()
  setCurrentEventId(eventConfig.id)

  return getDemoScenarioSummary()
}

export function seedCompleteDemoScenario(): DemoScenarioSummary {
  const eventConfig = getPrimaryDemoEvent()
  saveStoredRegistrations(mockRegistrations)
  saveStoredAnnouncements(mockAnnouncements)
  setCurrentEventId(eventConfig.id)

  return getDemoScenarioSummary()
}

export function getDemoScenarioSummary(): DemoScenarioSummary {
  const eventConfig = getPrimaryDemoEvent()
  const registrations = getStoredRegistrations().filter(
    (registration) => registration.eventId === eventConfig.id,
  )
  const announcements = getStoredAnnouncements().filter(
    (announcement) => announcement.eventId === eventConfig.id,
  )
  const dashboardSummary = getDashboardSummary(registrations)
  const announcementSummaries = getAnnouncementReviewSummaries(
    eventConfig,
    announcements,
    registrations,
  )

  return {
    currentEventName: eventConfig.name,
    totalRegistrations: dashboardSummary.totalRegistrations,
    pendingReviewCount: dashboardSummary.pendingReviewCount,
    registeredCount: dashboardSummary.registeredCount,
    checkedInCount: dashboardSummary.checkedInCount,
    inProgressCount: dashboardSummary.inProgressCount,
    finishedCount: dashboardSummary.finishedCount,
    announcementCount: announcements.length,
    unconfirmedAnnouncementCount: announcementSummaries.reduce(
      (total, announcement) => total + announcement.unconfirmedTotal,
      0,
    ),
  }
}

export function getPrimaryDemoEvent() {
  return (
    eventTemplates.find((eventConfig) => eventConfig.registrationMode === 'team') ??
    eventTemplates[0]
  )
}
