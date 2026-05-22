export interface RatingCriterion {
  key: string
  label: string
  description: string
  weight: number
}

export const RATING_CRITERIA: RatingCriterion[] = [
  {
    key: 'allowEntry',
    label: '允许进入',
    description: '是否真正允许宠物进入（室内 / 户外）',
    weight: 0.25,
  },
  {
    key: 'largeDogFriendly',
    label: '大型犬友好',
    description: '对大型犬的接受程度与体重限制',
    weight: 0.15,
  },
  {
    key: 'outdoorSpace',
    label: '户外空间',
    description: '是否有户外、半户外或绿化区域',
    weight: 0.15,
  },
  {
    key: 'staffAttitude',
    label: '店员态度',
    description: '员工对宠物及宠主的友善程度',
    weight: 0.2,
  },
  {
    key: 'petFacilities',
    label: '宠物设施',
    description: '水碗、宠物床、零食等设施完善程度',
    weight: 0.1,
  },
  {
    key: 'userFeedback',
    label: '用户反馈',
    description: '真实用户体验与避雷情况综合评分',
    weight: 0.15,
  },
]

export const VERIFICATION_LABELS: Record<string, { label: string; color: string; description: string }> = {
  onsite: {
    label: '已实地验证',
    color: 'green',
    description: '豆苗团队已亲赴探访确认',
  },
  phone: {
    label: '已电话确认',
    color: 'orange',
    description: '豆苗已致电商家确认宠物政策',
  },
  user: {
    label: '用户投稿',
    color: 'blue',
    description: '由用户提交，待官方核实',
  },
}

export const TAG_COLORS: Record<string, string> = {
  '可带大型犬': 'bg-amber-100 text-amber-800',
  '有户外位': 'bg-green-100 text-green-800',
  '需提前预约': 'bg-orange-100 text-orange-800',
  '店员友好': 'bg-rose-100 text-rose-800',
  '可进室内': 'bg-blue-100 text-blue-800',
  '仅限小型犬': 'bg-purple-100 text-purple-800',
  '提供水碗': 'bg-teal-100 text-teal-800',
  '宠物零食': 'bg-yellow-100 text-yellow-800',
  '实时视频监控': 'bg-indigo-100 text-indigo-800',
  '24小时照看': 'bg-violet-100 text-violet-800',
  '提供宠物床': 'bg-pink-100 text-pink-800',
  '提供宠物礼包': 'bg-amber-100 text-amber-800',
  '上门喂养': 'bg-green-100 text-green-800',
  '遛狗服务': 'bg-teal-100 text-teal-800',
  '美容护理': 'bg-rose-100 text-rose-800',
  '实时打卡': 'bg-blue-100 text-blue-800',
  '经验丰富': 'bg-amber-100 text-amber-800',
  '跨城运输': 'bg-indigo-100 text-indigo-800',
  '跨境接送': 'bg-violet-100 text-violet-800',
  '专业设备': 'bg-gray-100 text-gray-700',
  '空调车厢': 'bg-sky-100 text-sky-800',
  '实时定位': 'bg-blue-100 text-blue-800',
}

export function calculateOverallRating(breakdown: Record<string, number>): number {
  let total = 0
  let totalWeight = 0
  for (const criterion of RATING_CRITERIA) {
    const score = breakdown[criterion.key] ?? 0
    total += score * criterion.weight
    totalWeight += criterion.weight
  }
  return Math.round((total / totalWeight) * 10) / 10
}
