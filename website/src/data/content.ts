export type Language = 'en' | 'zh'

export const contactEmail = '1658684626@qq.com'

export const siteContent = {
  en: {
    meta: {
      eventOs: 'Event OS',
      requestAccess: 'Request Access',
      languageLabel: '中文',
      scroll: 'Explore / event operating system',
      enabled: 'active',
    },
    navItems: [
      { label: 'Product', href: '#product' },
      { label: 'Templates', href: '#templates' },
      { label: 'Signals', href: '#signals' },
      { label: 'AI', href: '#ai' },
      { label: 'Download', href: '#download' },
      { label: 'Contact', href: '#contact' },
    ],
    hero: {
      eyebrow: 'LIVE EVENT INFRASTRUCTURE',
      title: 'Events, made observable.',
      titleCn: '让每一场赛事变得可见、可控、可复盘。',
      description:
        'EasyEvent turns fragmented sports operations into one live system — from rules and registration to check-in, checkpoints, announcements and post-event intelligence.',
      primaryCta: 'Request Access',
      secondaryCta: 'Explore the System',
      principle:
        'If the event has rules, routes or people in motion, EasyEvent can configure it.',
    },
    thesisHeading: {
      index: '01 / Thesis',
      title: 'Events are not spreadsheets.',
      subtitle: 'Most event tools collect information. EasyEvent operates the event itself.',
    },
    thesis: [
      { number: '01', title: 'Forms collect data.', body: 'They do not run events.' },
      { number: '02', title: 'Chats send messages.', body: 'They do not confirm who received them.' },
      { number: '03', title: 'Spreadsheets list people.', body: 'They do not reveal live status.' },
      {
        number: '04',
        title: 'Manual reports remember moments.',
        body: 'They do not create reusable event intelligence.',
      },
    ],
    productHeading: {
      index: '02 / Product system',
      title: 'One operating system for live events.',
      subtitle: 'Configure the rules. Run the day. Keep the memory.',
    },
    productSystem: [
      {
        number: '01',
        title: 'Event Templates',
        body: 'Define routes, teams, fields, materials, checkpoints and notices before the event begins.',
        keyword: 'Define',
      },
      {
        number: '02',
        title: 'Registration Protocol',
        body: 'Turn sign-ups into structured records that can be reviewed, corrected and approved.',
        keyword: 'Review',
      },
      {
        number: '03',
        title: 'Check-in Layer',
        body: 'Know who has arrived, who has departed and who is still missing.',
        keyword: 'Locate',
      },
      {
        number: '04',
        title: 'Live Checkpoints',
        body: 'Track distributed teams, task submissions and progress across the event field.',
        keyword: 'Track',
      },
      {
        number: '05',
        title: 'Confirmation Network',
        body: 'Send targeted notices and verify which teams have acknowledged them.',
        keyword: 'Confirm',
      },
      {
        number: '06',
        title: 'Review Engine',
        body: 'Convert race-day operations into analytics for the next event.',
        keyword: 'Learn',
      },
    ],
    templatesHeading: {
      index: '03 / Templates',
      title: 'Not built for one race.',
      subtitle: 'EasyEvent is configured, not hard-coded.',
      configLabel: 'Every event starts as configuration.',
      table: ['Format', 'Mode', 'Rule type', 'Live operation', 'Analytics focus'],
    },
    templates: [
      ['City Hunt', 'Team-based routes', 'Checkpoints', 'Live task progress', 'Checkpoint pressure'],
      ['Campus Run', 'Individual entries', 'Check-in gates', 'Finish-rate analytics', 'Finish rate'],
      ['Basketball Tournament', 'Team rosters', 'Eligibility review', 'Match-day check-in', 'Roster readiness'],
      ['Family Sports Day', 'Guardian links', 'Age rules', 'Safer participant flows', 'Participant safety'],
      ['Corporate Team Building', 'Department teams', 'Mission points', 'Team contribution records', 'Contribution records'],
      ['Hiking & Trail Event', 'Route stages', 'Attention signals', 'Completion tracking', 'Completion risk'],
    ],
    eventConfigTokens: [
      'registrationMode',
      'projects',
      'teamRules',
      'memberFields',
      'materials',
      'checkpoints',
      'announcements',
      'analytics',
    ],
    signalsHeading: {
      index: '04 / Signal layer',
      title: 'The next signal layer.',
      subtitle:
        'EasyEvent is designed to connect future event operations with user-authorized health and wearable signals.',
      ecosystem: 'Future ecosystem',
      boundaries: 'Signal boundaries',
    },
    liveSignals: ['Step count', 'Movement state', 'Heart rate hints', 'Inactivity attention', 'Team activity', 'Route progress'],
    integrations: [
      'Apple Health',
      'HealthKit',
      'Android Health Connect',
      'Apple Watch',
      'Wear OS',
      'Fitbit',
      'Garmin',
      'Samsung Health',
      'GPS / Route services',
    ],
    signalPrinciples: [
      'Coming soon.',
      'User permission required.',
      'Privacy-first by design.',
      'Not for medical diagnosis.',
      'Organizers see operational signals, not raw private health data by default.',
    ],
    aiHeading: {
      index: '05 / Event copilot',
      title: 'Your event copilot.',
      subtitle: 'An AI layer for planning, explaining and summarizing event operations.',
      promptPanel: 'prompt panel',
      planned: 'coming soon',
      organizers: 'For organizers',
      participants: 'For participants',
    },
    organizerCopilot: [
      'Generate event templates.',
      'Draft urgent notices.',
      'Explain review issues.',
      'Summarize check-in status.',
      'Find teams needing attention.',
      'Produce post-event reports.',
    ],
    participantCopilot: [
      'Explain my registration status.',
      'Tell me what is missing.',
      'Show my next checkpoint.',
      'Summarize unread notices.',
    ],
    aiPrompts: [
      'Create a campus 5K event template.',
      'Which teams need attention right now?',
      'Draft a weather notice for Route B.',
      'Summarize today’s event operations.',
    ],
    aiBoundaries: [
      'Coming soon.',
      'Human confirmation required.',
      'No automatic approval, rejection or deletion.',
      'No medical advice.',
    ],
    downloadHeading: {
      index: '06 / Release',
      title: 'Download the command center.',
      subtitle:
        'EasyEvent is currently in private beta. Public mobile and desktop downloads are coming soon.',
    },
    downloads: [
      ['Android APK', 'Private beta build', 'Request access', 'Request Access'],
      ['iOS TestFlight', 'Invite only', 'Invite only', 'Contact Me'],
      ['Web App', 'Available for organization testing', 'Private preview', 'Request Access'],
      ['Windows', 'Planned desktop release', 'Planned', 'Request Access'],
    ],
    contactHeading: {
      index: '07 / Contact',
      title: 'Bring EasyEvent to your next event.',
      subtitle: 'Tell me what you are organizing. I’ll help map it into the first event template.',
      brief: 'Early Access Brief',
      button: 'Contact Me',
      successPrefix: 'Request captured locally. Send the prepared email:',
      successLink: 'open email draft',
      fields: {
        name: 'Name',
        email: 'Email',
        organization: 'Organization',
        eventType: 'Event type',
        message: 'Message',
      },
    },
    contactBrief: [
      ['Response window', 'Private beta'],
      ['Best for', 'City hunts, campus runs, team sports, family events, corporate activities'],
      ['First step', 'Send your event format, scale and rules.'],
    ],
    figure: {
      label: 'Live graph',
      stat: '42 moving teams',
    },
    footer: {
      tagline: 'A reusable operating system for sports event operations.',
      copyright: 'Copyright © 2026 EasyEvent.',
      emailLabel: 'Contact',
    },
  },
  zh: {
    meta: {
      eventOs: '赛事操作系统',
      requestAccess: '申请体验',
      languageLabel: 'EN',
      scroll: '浏览 / 赛事操作系统',
      enabled: '启用',
    },
    navItems: [
      { label: '产品', href: '#product' },
      { label: '模板', href: '#templates' },
      { label: '信号', href: '#signals' },
      { label: 'AI', href: '#ai' },
      { label: '下载', href: '#download' },
      { label: '联系', href: '#contact' },
    ],
    hero: {
      eyebrow: 'LIVE EVENT INFRASTRUCTURE',
      title: '让赛事变得可观测。',
      titleCn: 'Events, made observable.',
      description:
        'EasyEvent 将分散的体育赛事运营转化为一个实时系统：从规则、报名、检录、点位、通知到赛后智能复盘。',
      primaryCta: '申请体验',
      secondaryCta: '查看系统',
      principle: '只要赛事有规则、路线或移动中的人，EasyEvent 就能配置它。',
    },
    thesisHeading: {
      index: '01 / 核心判断',
      title: '赛事不是电子表格。',
      subtitle: '大多数工具只收集信息。EasyEvent 运营赛事本身。',
    },
    thesis: [
      { number: '01', title: '表单收集数据。', body: '但它们不能运营赛事。' },
      { number: '02', title: '群聊发送消息。', body: '但它们不能确认谁真正收到。' },
      { number: '03', title: '表格列出人员。', body: '但它们不能显示实时状态。' },
      { number: '04', title: '人工报告记录瞬间。', body: '但它们很难生成可复用的赛事智能。' },
    ],
    productHeading: {
      index: '02 / 产品系统',
      title: '一套系统，运营实时赛事。',
      subtitle: '配置规则。运营当天。保留记忆。',
    },
    productSystem: [
      {
        number: '01',
        title: '赛事模板',
        body: '在赛事开始前定义路线、队伍、字段、材料、点位和通知。',
        keyword: '定义',
      },
      {
        number: '02',
        title: '报名协议',
        body: '把报名转成可以审核、修正和批准的结构化记录。',
        keyword: '审核',
      },
      {
        number: '03',
        title: '检录层',
        body: '知道谁已到场、谁已出发、谁仍然缺席。',
        keyword: '定位',
      },
      {
        number: '04',
        title: '实时点位',
        body: '跟踪分散队伍、任务提交和现场进度。',
        keyword: '跟踪',
      },
      {
        number: '05',
        title: '确认网络',
        body: '向指定对象发送通知，并确认哪些队伍已经知悉。',
        keyword: '确认',
      },
      {
        number: '06',
        title: '复盘引擎',
        body: '把比赛日运营转化为下一场赛事的分析依据。',
        keyword: '学习',
      },
    ],
    templatesHeading: {
      index: '03 / 赛事模板',
      title: '不只为一场比赛而建。',
      subtitle: 'EasyEvent 依靠配置复用，而不是写死页面。',
      configLabel: '每场赛事都从配置开始。',
      table: ['赛事类型', '报名模式', '规则类型', '现场执行', '复盘重点'],
    },
    templates: [
      ['城市定向赛', '队伍路线', '点位任务', '实时任务进度', '点位压力'],
      ['校园跑步赛', '个人报名', '检录闸口', '完赛率分析', '完赛率'],
      ['篮球锦标赛', '球队名单', '资格审核', '比赛日检录', '名单就绪度'],
      ['亲子运动会', '监护人关联', '年龄规则', '更安全的参与流程', '参与安全'],
      ['企业团建赛', '部门队伍', '任务点', '团队贡献记录', '贡献记录'],
      ['徒步越野活动', '路线阶段', '关注信号', '完成跟踪', '完成风险'],
    ],
    eventConfigTokens: [
      'registrationMode',
      'projects',
      'teamRules',
      'memberFields',
      'materials',
      'checkpoints',
      'announcements',
      'analytics',
    ],
    signalsHeading: {
      index: '04 / 信号层',
      title: '下一层赛事信号。',
      subtitle: 'EasyEvent 被设计为未来可连接用户授权的健康平台和可穿戴设备信号。',
      ecosystem: '未来生态',
      boundaries: '信号边界',
    },
    liveSignals: ['步数', '运动状态', '心率提示', '未活动关注', '团队活动', '路线进度'],
    integrations: [
      'Apple Health',
      'HealthKit',
      'Android Health Connect',
      'Apple Watch',
      'Wear OS',
      'Fitbit',
      'Garmin',
      'Samsung Health',
      'GPS / 路线服务',
    ],
    signalPrinciples: [
      '即将推出。',
      '必须获得用户授权。',
      '隐私优先设计。',
      '不用于医疗诊断。',
      '管理端默认只看运营信号，不展示原始个人健康数据。',
    ],
    aiHeading: {
      index: '05 / 赛事 Copilot',
      title: '你的赛事 AI 助手。',
      subtitle: '用于规划、解释和总结赛事运营的智能层。',
      promptPanel: '提示面板',
      planned: '即将推出',
      organizers: '面向组织方',
      participants: '面向参赛者',
    },
    organizerCopilot: [
      '生成赛事模板。',
      '起草紧急通知。',
      '解释审核问题。',
      '汇总检录状态。',
      '找出需要关注的队伍。',
      '生成赛后报告。',
    ],
    participantCopilot: [
      '解释我的报名状态。',
      '告诉我还缺什么资料。',
      '显示我的下一个点位。',
      '汇总未读通知。',
    ],
    aiPrompts: [
      '创建一个校园 5 公里跑步赛模板。',
      '现在有哪些队伍需要关注？',
      '为 B 路线起草一条天气提醒。',
      '总结今天的赛事运营情况。',
    ],
    aiBoundaries: ['即将推出。', '关键操作必须人工确认。', '不会自动批准、驳回或删除。', '不提供医疗建议。'],
    downloadHeading: {
      index: '06 / 发布',
      title: '下载赛事指挥中心。',
      subtitle: 'EasyEvent 目前处于私人测试阶段，公开移动端和桌面端下载即将开放。',
    },
    downloads: [
      ['Android APK', '私人测试安装包', '申请体验', '申请体验'],
      ['iOS TestFlight', '邀请制测试', '邀请制', '联系我'],
      ['Web App', '面向组织测试开放', '私人预览', '申请体验'],
      ['Windows', '桌面端版本', '规划中', '申请体验'],
    ],
    contactHeading: {
      index: '07 / 联系',
      title: '把 EasyEvent 带到你的下一场赛事。',
      subtitle: '告诉我你正在组织什么活动，我会帮你映射成第一套赛事模板。',
      brief: '早期访问说明',
      button: '联系我',
      successPrefix: '已在本地生成请求。你可以发送邮件草稿：',
      successLink: '打开邮件草稿',
      fields: {
        name: '姓名',
        email: '邮箱',
        organization: '组织 / 学校 / 公司',
        eventType: '赛事类型',
        message: '留言',
      },
    },
    contactBrief: [
      ['响应窗口', '私人测试'],
      ['适合活动', '城市定向、校园跑、团队球赛、亲子活动、企业活动'],
      ['第一步', '发送你的赛事形式、规模和规则。'],
    ],
    figure: {
      label: '实时图谱',
      stat: '42 支队伍移动中',
    },
    footer: {
      tagline: '面向体育赛事运营的可复用操作系统。',
      copyright: 'Copyright © 2026 EasyEvent.',
      emailLabel: '联系邮箱',
    },
  },
} satisfies Record<Language, {
  meta: {
    eventOs: string
    requestAccess: string
    languageLabel: string
    scroll: string
    enabled: string
  }
  navItems: { label: string; href: string }[]
  hero: {
    eyebrow: string
    title: string
    titleCn: string
    description: string
    primaryCta: string
    secondaryCta: string
    principle: string
  }
  thesisHeading: { index: string; title: string; subtitle: string }
  thesis: { number: string; title: string; body: string }[]
  productHeading: { index: string; title: string; subtitle: string }
  productSystem: { number: string; title: string; body: string; keyword: string }[]
  templatesHeading: { index: string; title: string; subtitle: string; configLabel: string; table: string[] }
  templates: string[][]
  eventConfigTokens: string[]
  signalsHeading: { index: string; title: string; subtitle: string; ecosystem: string; boundaries: string }
  liveSignals: string[]
  integrations: string[]
  signalPrinciples: string[]
  aiHeading: {
    index: string
    title: string
    subtitle: string
    promptPanel: string
    planned: string
    organizers: string
    participants: string
  }
  organizerCopilot: string[]
  participantCopilot: string[]
  aiPrompts: string[]
  aiBoundaries: string[]
  downloadHeading: { index: string; title: string; subtitle: string }
  downloads: string[][]
  contactHeading: {
    index: string
    title: string
    subtitle: string
    brief: string
    button: string
    successPrefix: string
    successLink: string
    fields: {
      name: string
      email: string
      organization: string
      eventType: string
      message: string
    }
  }
  contactBrief: string[][]
  figure: { label: string; stat: string }
  footer: { tagline: string; copyright: string; emailLabel: string }
}>

export type SiteCopy = (typeof siteContent)[Language]
