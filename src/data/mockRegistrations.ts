import { eventTemplates } from './eventTemplates'
import type { Registration } from '../types/registration'

const event = (eventId: string) => {
  const found = eventTemplates.find((item) => item.id === eventId)

  if (!found) {
    throw new Error(`Unknown event template: ${eventId}`)
  }

  return found
}

const zhuHai = event('zhuhai-robinson-orienteering')
const campusRun = event('campus-5k-run')
const basketball = event('campus-basketball')

const now = '2026-05-28T09:00:00.000Z'

export const mockRegistrations: Registration[] = [
  {
    id: 'reg-draft-team',
    eventId: zhuHai.id,
    projectId: 'family-route',
    mode: 'team',
    teamName: '海风小队',
    captainName: '林晓',
    captainPhone: '13800000001',
    members: [
      {
        id: 'member-draft-1',
        name: '林晓',
        phone: '13800000001',
        roleType: '亲子',
        formData: { roleCategory: '亲子' },
        materials: [{ ruleId: 'guardian-consent', status: 'missing' }],
      },
    ],
    status: 'draft',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: [],
    auditLogs: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-incomplete-team',
    eventId: zhuHai.id,
    projectId: 'campus-alumni-route',
    mode: 'team',
    teamName: '青榕校友队',
    captainName: '陈予',
    captainPhone: '13800000002',
    members: [
      {
        id: 'member-incomplete-1',
        name: '陈予',
        phone: '13800000002',
        roleType: '校友',
        formData: {
          roleCategory: '校友',
          idNumber: '440400199901010011',
        },
        materials: [{ ruleId: 'alumni-proof', status: 'missing' }],
      },
      {
        id: 'member-incomplete-2',
        name: '',
        phone: '',
        roleType: '学生',
        formData: { roleCategory: '学生' },
        materials: [{ ruleId: 'student-card', status: 'missing' }],
      },
    ],
    status: 'incomplete',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: [],
    auditLogs: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-pending-review-team',
    eventId: zhuHai.id,
    projectId: 'open-challenge-route',
    mode: 'team',
    teamName: '城市探路者',
    captainName: '黄一鸣',
    captainPhone: '13800000003',
    members: [
      {
        id: 'member-pending-1',
        name: '黄一鸣',
        phone: '13800000003',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199501010031',
          emergencyContact: '黄女士 13900000003',
        },
        materials: [],
      },
      {
        id: 'member-pending-2',
        name: '张然',
        phone: '13800000004',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199601010041',
          emergencyContact: '张先生 13900000004',
        },
        materials: [],
      },
      {
        id: 'member-pending-3',
        name: '赵清',
        phone: '13800000005',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199701010051',
          emergencyContact: '赵女士 13900000005',
        },
        materials: [],
      },
      {
        id: 'member-pending-4',
        name: '梁森',
        phone: '13800000006',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199801010061',
          emergencyContact: '梁先生 13900000006',
        },
        materials: [],
      },
    ],
    status: 'pending_review',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: ['route-reminder'],
    auditLogs: [
      {
        id: 'audit-pending-1',
        action: '提交审核',
        operator: '队长',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-rejected-team',
    eventId: zhuHai.id,
    projectId: 'campus-alumni-route',
    mode: 'team',
    teamName: '老友重逢队',
    captainName: '吴彬',
    captainPhone: '13800000007',
    members: [
      {
        id: 'member-rejected-1',
        name: '吴彬',
        phone: '13800000007',
        roleType: '校友',
        formData: {
          roleCategory: '校友',
          idNumber: '440400199001010071',
          emergencyContact: '吴女士 13900000007',
        },
        materials: [
          {
            ruleId: 'alumni-proof',
            fileName: 'alumni-card-blurry.jpg',
            status: 'rejected',
            rejectReason: '图片模糊，无法识别姓名。',
          },
        ],
      },
      {
        id: 'member-rejected-2',
        name: '宋晴',
        phone: '13800000008',
        roleType: '校友',
        formData: {
          roleCategory: '校友',
          idNumber: '440400199101010081',
          emergencyContact: '宋先生 13900000008',
        },
        materials: [
          {
            ruleId: 'alumni-proof',
            fileName: 'song-alumni.pdf',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-rejected-3',
        name: '李澄',
        phone: '13800000009',
        roleType: '校友',
        formData: {
          roleCategory: '校友',
          idNumber: '440400199201010091',
          emergencyContact: '李女士 13900000009',
        },
        materials: [
          {
            ruleId: 'alumni-proof',
            fileName: 'li-alumni.pdf',
            status: 'approved',
          },
        ],
      },
    ],
    status: 'rejected',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: [],
    auditLogs: [
      {
        id: 'audit-rejected-1',
        action: '审核驳回',
        reason: '队长校友证明图片模糊。',
        operator: '管理员',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-registered-team',
    eventId: zhuHai.id,
    projectId: 'family-route',
    mode: 'team',
    teamName: '星星亲子队',
    captainName: '周宁',
    captainPhone: '13800000010',
    members: [
      {
        id: 'member-registered-1',
        name: '周宁',
        phone: '13800000010',
        roleType: '亲子',
        formData: {
          roleCategory: '亲子',
          idNumber: '440400198801010101',
          emergencyContact: '周先生 13900000010',
          guardianName: '周宁',
        },
        materials: [
          {
            ruleId: 'guardian-consent',
            fileName: 'guardian-consent.pdf',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-registered-2',
        name: '周小星',
        phone: '13800000011',
        roleType: '亲子',
        formData: {
          roleCategory: '亲子',
          idNumber: '440400201501010111',
          emergencyContact: '周宁 13800000010',
          guardianName: '周宁',
        },
        materials: [
          {
            ruleId: 'guardian-consent',
            fileName: 'child-consent.pdf',
            status: 'approved',
          },
        ],
      },
    ],
    status: 'registered',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: ['route-reminder', 'safety-alert'],
    auditLogs: [
      {
        id: 'audit-registered-1',
        action: '审核通过',
        operator: '管理员',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-checked-in-team',
    eventId: zhuHai.id,
    projectId: 'campus-alumni-route',
    mode: 'team',
    teamName: '湾区校友队',
    captainName: '许舟',
    captainPhone: '13800000012',
    members: [
      {
        id: 'member-checked-1',
        name: '许舟',
        phone: '13800000012',
        roleType: '校友',
        formData: {
          roleCategory: '校友',
          idNumber: '440400199301010121',
          emergencyContact: '许女士 13900000012',
        },
        materials: [
          {
            ruleId: 'alumni-proof',
            fileName: 'xu-alumni.pdf',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-checked-2',
        name: '邓一',
        phone: '13800000013',
        roleType: '学生',
        formData: {
          roleCategory: '学生',
          idNumber: '440400200301010131',
          emergencyContact: '邓先生 13900000013',
        },
        materials: [
          {
            ruleId: 'student-card',
            fileName: 'deng-student.jpg',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-checked-3',
        name: '何青',
        phone: '13800000014',
        roleType: '学生',
        formData: {
          roleCategory: '学生',
          idNumber: '440400200401010141',
          emergencyContact: '何女士 13900000014',
        },
        materials: [
          {
            ruleId: 'student-card',
            fileName: 'he-student.jpg',
            status: 'approved',
          },
        ],
      },
    ],
    status: 'registered',
    checkinStatus: 'checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [
      { checkpointId: 'city-gate', status: 'arrived', submittedAt: now },
    ],
    announcementsConfirmed: ['route-reminder'],
    auditLogs: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-in-progress-team',
    eventId: zhuHai.id,
    projectId: 'open-challenge-route',
    mode: 'team',
    teamName: '极速海岸队',
    captainName: '马骁',
    captainPhone: '13800000015',
    members: [
      {
        id: 'member-progress-1',
        name: '马骁',
        phone: '13800000015',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199401010151',
          emergencyContact: '马女士 13900000015',
        },
        materials: [],
      },
      {
        id: 'member-progress-2',
        name: '罗清',
        phone: '13800000016',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199501010161',
          emergencyContact: '罗先生 13900000016',
        },
        materials: [],
      },
      {
        id: 'member-progress-3',
        name: '郭川',
        phone: '13800000017',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199601010171',
          emergencyContact: '郭女士 13900000017',
        },
        materials: [],
      },
      {
        id: 'member-progress-4',
        name: '苏夏',
        phone: '13800000018',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199701010181',
          emergencyContact: '苏先生 13900000018',
        },
        materials: [],
      },
    ],
    status: 'registered',
    checkinStatus: 'departed',
    executionStatus: 'in_progress',
    checkpointProgress: [
      { checkpointId: 'city-gate', status: 'approved', submittedAt: now },
      {
        checkpointId: 'library-clue',
        status: 'submitted',
        submittedAt: now,
        note: '已提交城市文化答案。',
      },
      {
        checkpointId: 'seaside-photo',
        status: 'arrived',
        submittedAt: now,
      },
    ],
    announcementsConfirmed: ['route-reminder', 'safety-alert'],
    auditLogs: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-attention-team',
    eventId: zhuHai.id,
    projectId: 'open-challenge-route',
    mode: 'team',
    teamName: '慢慢探索队',
    captainName: '冯澜',
    captainPhone: '13800000019',
    members: [
      {
        id: 'member-attention-1',
        name: '冯澜',
        phone: '13800000019',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199301010191',
          emergencyContact: '冯先生 13900000019',
        },
        materials: [],
      },
      {
        id: 'member-attention-2',
        name: '潘可',
        phone: '13800000020',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199401010201',
          emergencyContact: '潘女士 13900000020',
        },
        materials: [],
      },
      {
        id: 'member-attention-3',
        name: '叶帆',
        phone: '13800000021',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199501010211',
          emergencyContact: '叶先生 13900000021',
        },
        materials: [],
      },
      {
        id: 'member-attention-4',
        name: '曾雨',
        phone: '13800000022',
        roleType: '社会人士',
        formData: {
          roleCategory: '社会人士',
          idNumber: '440400199601010221',
          emergencyContact: '曾女士 13900000022',
        },
        materials: [],
      },
    ],
    status: 'registered',
    checkinStatus: 'departed',
    executionStatus: 'attention_needed',
    checkpointProgress: [
      { checkpointId: 'city-gate', status: 'approved', submittedAt: now },
      {
        checkpointId: 'library-clue',
        status: 'arrived',
        submittedAt: now,
        note: '超过预计时间仍未提交任务。',
      },
    ],
    announcementsConfirmed: [],
    auditLogs: [
      {
        id: 'audit-attention-1',
        action: '标记异常关注',
        reason: '路线中段停留过久，且紧急通知未确认。',
        operator: '现场管理员',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-campus-run-personal',
    eventId: campusRun.id,
    projectId: '5k',
    mode: 'individual',
    captainName: '刘晨',
    captainPhone: '13800000023',
    members: [
      {
        id: 'member-run-1',
        name: '刘晨',
        phone: '13800000023',
        roleType: '学生',
        formData: {
          studentOrStaffId: '20260123',
          healthCommitment: true,
          emergencyContact: '刘先生 13900000023',
        },
        materials: [],
      },
    ],
    status: 'registered',
    checkinStatus: 'departed',
    executionStatus: 'finished',
    checkpointProgress: [
      { checkpointId: 'run-checkin', status: 'approved', submittedAt: now },
      { checkpointId: 'supply-station', status: 'arrived', submittedAt: now },
      { checkpointId: 'finish-line', status: 'approved', submittedAt: now },
    ],
    announcementsConfirmed: ['race-guide', 'weather-warning'],
    auditLogs: [
      {
        id: 'audit-run-finished-1',
        action: 'finished',
        reason: '所有必需点位已完成，标记完赛',
        operator: '工作人员',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'reg-basketball-team',
    eventId: basketball.id,
    projectId: 'mixed',
    mode: 'team',
    teamName: '晴空三分队',
    captainName: '郑跃',
    captainPhone: '13800000024',
    members: [
      {
        id: 'member-ball-1',
        name: '郑跃',
        phone: '13800000024',
        roleType: '队长',
        formData: {
          studentId: 'B2026001',
          jerseyNumber: 7,
          position: '后卫',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'captain-id.jpg',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-ball-2',
        name: '高晴',
        phone: '13800000025',
        roleType: '球员',
        formData: {
          studentId: 'B2026002',
          jerseyNumber: 12,
          position: '前锋',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'gao-id.jpg',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-ball-3',
        name: '莫然',
        phone: '13800000026',
        roleType: '球员',
        formData: {
          studentId: 'B2026003',
          jerseyNumber: 21,
          position: '中锋',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'mo-id.jpg',
            status: 'uploaded',
          },
        ],
      },
      {
        id: 'member-ball-4',
        name: '秦立',
        phone: '13800000027',
        roleType: '球员',
        formData: {
          studentId: 'B2026004',
          jerseyNumber: 3,
          position: '后卫',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'qin-id.jpg',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-ball-5',
        name: '唐雨',
        phone: '13800000028',
        roleType: '球员',
        formData: {
          studentId: 'B2026005',
          jerseyNumber: 18,
          position: '前锋',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'tang-id.jpg',
            status: 'approved',
          },
        ],
      },
      {
        id: 'member-ball-6',
        name: '陆川',
        phone: '13800000029',
        roleType: '球员',
        formData: {
          studentId: 'B2026006',
          jerseyNumber: 30,
          position: '不限',
        },
        materials: [
          {
            ruleId: 'player-id',
            fileName: 'lu-id.jpg',
            status: 'approved',
          },
        ],
      },
    ],
    status: 'registered',
    checkinStatus: 'not_checked_in',
    executionStatus: 'not_started',
    checkpointProgress: [],
    announcementsConfirmed: ['schedule-update'],
    auditLogs: [
      {
        id: 'audit-ball-2',
        action: 'registered',
        reason: '确认进入正式报名名单',
        operator: '管理员',
        createdAt: now,
      },
      {
        id: 'audit-ball-1',
        action: 'approved',
        reason: '资料审核通过',
        operator: '管理员',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
]
