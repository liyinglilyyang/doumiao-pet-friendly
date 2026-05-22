export type PlaceType = 'hotel' | 'cafe' | 'restaurant' | 'boarding' | 'service' | 'transport'
export type CityType = 'guangzhou' | 'shenzhen' | 'hongkong'
export type VerificationStatus = 'phone' | 'onsite' | 'user'

export interface RatingBreakdown {
  allowEntry: number
  largeDogFriendly: number
  outdoorSpace: number
  staffAttitude: number
  petFacilities: number
  userFeedback: number
}

export interface PetRules {
  canEnterIndoor: boolean
  largeDogAllowed: boolean
  leashRequired: boolean
  appointmentRequired: boolean
  cleaningFee?: string
  maxWeight?: string
  notes?: string
}

export interface Verification {
  status: VerificationStatus
  phoneConfirmedAt?: string
  onsiteVisitedAt?: string
  lastUpdated: string
  summary: string
}

export interface Place {
  id: string
  name: string
  nameEn?: string
  city: CityType
  district: string
  type: PlaceType
  images: string[]
  coverImage: string
  tags: string[]
  rating: number
  ratingBreakdown: RatingBreakdown
  verification: Verification
  petRules: PetRules
  warning?: string
  address: string
  priceRange?: string
  description: string
  phone?: string
  wechat?: string
}

export const CITY_LABELS: Record<CityType, string> = {
  guangzhou: '广州',
  shenzhen: '深圳',
  hongkong: '香港',
}

export const TYPE_LABELS: Record<PlaceType, string> = {
  hotel: '宠物友好酒店',
  cafe: '宠物友好咖啡',
  restaurant: '宠物友好餐厅',
  boarding: '宠物寄养',
  service: '上门服务',
  transport: '宠物运输',
}

export const TYPE_EMOJIS: Record<PlaceType, string> = {
  hotel: '🏨',
  cafe: '☕',
  restaurant: '🍽️',
  boarding: '🏠',
  service: '🛎️',
  transport: '🚗',
}

export const places: Place[] = [
  {
    id: 'gz-w-hotel',
    name: 'W酒店广州',
    nameEn: 'W Hotel Guangzhou',
    city: 'guangzhou',
    district: '天河区',
    type: 'hotel',
    coverImage:
      'https://images.unsplash.com/photo-1566073771905-5df06b3e4f2e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771905-5df06b3e4f2e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['可带大型犬', '有户外位', '需提前预约', '店员友好'],
    rating: 4.6,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 5,
      outdoorSpace: 4,
      staffAttitude: 5,
      petFacilities: 4,
      userFeedback: 4,
    },
    verification: {
      status: 'onsite',
      phoneConfirmedAt: '2025-11-10',
      onsiteVisitedAt: '2025-12-05',
      lastUpdated: '2025-12-05',
      summary: '已实地探访确认。宠物可随主人入住，大厅及客房均允许进入。需提前致电说明携带宠物，入住时需填写宠物登记表。酒店提供宠物专属欢迎礼包。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: true,
      appointmentRequired: true,
      cleaningFee: '¥200/晚（押金，退房后归还）',
      maxWeight: '无限制',
      notes: '需提前48小时预约，告知宠物品种及体重。部分楼层为无宠物楼层，请在预订时注明。',
    },
    address: '广州市天河区天河路385号',
    priceRange: '¥1200-3000/晚',
    description: 'W酒店广州对宠物极为欢迎，大型犬和小型犬均可入住。酒店员工经过专业培训，能够为毛孩子提供温馨服务。酒店设有宠物友好房型，配备宠物床、水碗等设施。',
    phone: '020-12345678',
    wechat: 'wgz_petfriendly',
    warning: undefined,
  },
  {
    id: 'gz-kuddo-coffee',
    name: 'KUDDO COFFEE',
    nameEn: 'KUDDO COFFEE',
    city: 'guangzhou',
    district: '海珠区',
    type: 'cafe',
    coverImage:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['店员友好', '有户外位', '可进室内', '提供水碗'],
    rating: 4.8,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 4,
      outdoorSpace: 5,
      staffAttitude: 5,
      petFacilities: 5,
      userFeedback: 5,
    },
    verification: {
      status: 'phone',
      phoneConfirmedAt: '2026-01-15',
      lastUpdated: '2026-01-15',
      summary: '电话确认：宠物可进入室内及户外区域，店内常备水碗，店员非常热爱动物。周末人多时建议避开高峰时段。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: false,
      leashRequired: true,
      appointmentRequired: false,
      maxWeight: '20kg以内',
      notes: '大型犬（20kg以上）仅限户外区域。店内提供宠物零食，可购买。',
    },
    address: '广州市海珠区滨江东路200号',
    priceRange: '¥30-60/人',
    description: 'KUDDO COFFEE 是广州海珠区知名宠物友好咖啡店，拥有宽敞的半户外空间。店主本身是狗狗爱好者，定期举办宠物社交活动，氛围轻松温馨。',
    phone: '020-98765432',
    wechat: 'kuddo_coffee_gz',
    warning: undefined,
  },
  {
    id: 'gz-the-yard',
    name: 'THE YARD 庭院餐厅',
    nameEn: 'THE YARD',
    city: 'guangzhou',
    district: '越秀区',
    type: 'restaurant',
    coverImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611175694984-b0df5e6f9f9f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['有户外位', '店员友好', '仅限小型犬'],
    rating: 4.3,
    ratingBreakdown: {
      allowEntry: 4,
      largeDogFriendly: 2,
      outdoorSpace: 5,
      staffAttitude: 4,
      petFacilities: 3,
      userFeedback: 4,
    },
    verification: {
      status: 'user',
      lastUpdated: '2026-02-20',
      summary: '多位用户反馈：庭院区域对宠物非常友好，室内暂不允许进入。员工会主动为宠物提供水。建议工作日前往，周末庭院座位较紧张。',
    },
    petRules: {
      canEnterIndoor: false,
      largeDogAllowed: false,
      leashRequired: true,
      appointmentRequired: false,
      maxWeight: '15kg以内',
      notes: '仅庭院区域允许宠物，室内不可进入。请确保宠物不打扰其他用餐客人。',
    },
    address: '广州市越秀区东风中路166号',
    priceRange: '¥80-150/人',
    description: '历史建筑改造的庭院餐厅，环境优雅，绿植丰富。宽敞的庭院区域非常适合带宠物一起用餐，空气清新，毛孩子可以自由活动。',
    wechat: 'theyard_gz',
    warning: '室内区域严禁携带宠物，请勿尝试带入，曾有用户被要求离席。',
  },
  {
    id: 'gz-meng-chong',
    name: '萌宠之家 宠物酒店',
    nameEn: 'Pet Paradise Hotel',
    city: 'guangzhou',
    district: '白云区',
    type: 'boarding',
    coverImage:
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534361960057-19f4434a4f0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['可带大型犬', '店员友好', '实时视频监控', '24小时照看'],
    rating: 4.7,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 5,
      outdoorSpace: 4,
      staffAttitude: 5,
      petFacilities: 5,
      userFeedback: 4,
    },
    verification: {
      status: 'onsite',
      phoneConfirmedAt: '2025-10-08',
      onsiteVisitedAt: '2025-11-20',
      lastUpdated: '2025-11-20',
      summary: '已实地探访。设施干净整洁，房间宽敞，大小型犬均有对应空间。提供实时监控视频，家长可随时查看。工作人员专业且热情。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: false,
      appointmentRequired: true,
      cleaningFee: undefined,
      notes: '需提前预约，携带宠物疫苗证明及健康证。可提供定制饮食服务，需提前告知。',
    },
    address: '广州市白云区机场路1288号',
    priceRange: '¥80-300/晚',
    description: '萌宠之家是广州知名宠物寄养机构，提供大中小型犬猫一站式寄养服务。24小时专业看护，配备户外运动区、洗澡美容区及独立休息区。',
    phone: '020-33344455',
    wechat: 'mengchong_gz',
    warning: undefined,
  },
  {
    id: 'sz-hotel-icon',
    name: 'HOTEL ICON 深圳',
    nameEn: 'Hotel Icon Shenzhen',
    city: 'shenzhen',
    district: '南山区',
    type: 'hotel',
    coverImage:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['有户外位', '需提前预约', '提供宠物床', '店员友好'],
    rating: 4.5,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 3,
      outdoorSpace: 4,
      staffAttitude: 5,
      petFacilities: 4,
      userFeedback: 4,
    },
    verification: {
      status: 'phone',
      phoneConfirmedAt: '2026-01-28',
      lastUpdated: '2026-01-28',
      summary: '电话确认：接受宠物入住，25kg以下犬猫均可。需提前预订宠物房型，额外收取宠物费用¥150/晚。提供宠物专属礼遇。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: false,
      leashRequired: true,
      appointmentRequired: true,
      cleaningFee: '¥150/晚（宠物附加费）',
      maxWeight: '25kg以内',
      notes: '需预订宠物友好房型。大堂区域宠物需使用牵引绳。不可进入餐厅、泳池等公共区域。',
    },
    address: '深圳市南山区科技园南路88号',
    priceRange: '¥800-2000/晚',
    description: 'Hotel Icon 深圳位于南山科技园核心区，商务与宠物友好并重。酒店拥有独立宠物入住通道，提供专业宠物服务，是深圳高端出行首选。',
    phone: '0755-12345678',
    wechat: 'hotelicon_sz',
    warning: undefined,
  },
  {
    id: 'sz-brew-bear',
    name: 'BREW BEAR COFFEE',
    nameEn: 'Brew Bear Coffee',
    city: 'shenzhen',
    district: '福田区',
    type: 'cafe',
    coverImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['店员友好', '可进室内', '有户外位', '提供水碗', '宠物零食'],
    rating: 4.9,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 5,
      outdoorSpace: 5,
      staffAttitude: 5,
      petFacilities: 5,
      userFeedback: 5,
    },
    verification: {
      status: 'onsite',
      phoneConfirmedAt: '2025-12-10',
      onsiteVisitedAt: '2026-01-05',
      lastUpdated: '2026-01-05',
      summary: '实地探访：深圳最友好宠物咖啡之一。室内外均可携带宠物，大型犬亦可进入室内。店员热情，会主动招待毛孩子。店内有宠物专属菜单（肉泥杯、狗狗蛋糕）。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: false,
      appointmentRequired: false,
      notes: '全场宠物友好，无需牵引绳（但建议遛狗控制）。提供宠物饮水站，可自助取用。',
    },
    address: '深圳市福田区车公庙泰然工业园',
    priceRange: '¥35-70/人',
    description: 'BREW BEAR 是深圳口碑最好的宠物友好咖啡店，无论大型犬还是小猫咪都热烈欢迎。工业风格空间宽敞，店主本人有两只拉布拉多，深度理解爱宠人士需求。',
    phone: '0755-87654321',
    wechat: 'brewbear_sz',
    warning: undefined,
  },
  {
    id: 'hk-the-murray',
    name: 'The Murray Hong Kong',
    nameEn: 'The Murray Hong Kong',
    city: 'hongkong',
    district: '中环',
    type: 'hotel',
    coverImage:
      'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771905-5df06b3e4f2e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['可带大型犬', '有户外位', '需提前预约', '提供宠物礼包'],
    rating: 4.4,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 4,
      outdoorSpace: 3,
      staffAttitude: 5,
      petFacilities: 4,
      userFeedback: 4,
    },
    verification: {
      status: 'phone',
      phoneConfirmedAt: '2026-02-10',
      lastUpdated: '2026-02-10',
      summary: '电话确认（英文沟通）：接受宠物入住，需提前预订并支付押金HKD 500。提供宠物欢迎礼包，含零食、玩具和宠物床。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: true,
      appointmentRequired: true,
      cleaningFee: 'HKD 500押金（退房归还）',
      maxWeight: '30kg以内',
      notes: '需提前72小时告知携带宠物。宠物不可进入餐厅及酒吧区域。电梯使用需征得同行客人同意。',
    },
    address: 'Murray Rd, Central, Hong Kong',
    priceRange: 'HKD 2000-5000/晚',
    description: 'The Murray 是香港中环标志性历史建筑改造的精品酒店，宠物政策友好。酒店紧邻香港公园，是带爱犬探索香港岛的理想住所。',
    phone: '+852-12345678',
    wechat: 'themurray_hk',
    warning: undefined,
  },
  {
    id: 'gz-mao-service',
    name: '毛毛上门服务',
    nameEn: 'MaoMao Pet Service',
    city: 'guangzhou',
    district: '天河区 / 越秀区',
    type: 'service',
    coverImage:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['上门喂养', '遛狗服务', '美容护理', '实时打卡', '经验丰富'],
    rating: 4.6,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 5,
      outdoorSpace: 4,
      staffAttitude: 5,
      petFacilities: 4,
      userFeedback: 4,
    },
    verification: {
      status: 'user',
      lastUpdated: '2026-03-01',
      summary: '多位用户好评：服务认真负责，每次上门均发送照片和视频。喂养、遛狗均按时完成，与宠物互动自然。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: false,
      appointmentRequired: true,
      notes: '提前1天预约。服务区域覆盖天河区、越秀区、海珠区。服务结束发送实时打卡记录。',
    },
    address: '广州市天河区（上门服务，覆盖天河/越秀/海珠）',
    priceRange: '¥60-150/次',
    description: '毛毛上门服务团队拥有2年以上专业宠物护理经验，提供上门喂养、遛狗、洗澡、美容等全方位服务。每次服务全程打卡，让主人安心出行。',
    phone: '137-xxxx-xxxx',
    wechat: 'maomao_petservice',
    warning: undefined,
  },
  {
    id: 'gz-paws-transport',
    name: '爪子宠物运输',
    nameEn: 'Paws Transport',
    city: 'guangzhou',
    district: '全市覆盖',
    type: 'transport',
    coverImage:
      'https://images.unsplash.com/photo-1534361960057-19f4434a4f0f?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1534361960057-19f4434a4f0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['跨城运输', '跨境接送', '专业设备', '空调车厢', '实时定位'],
    rating: 4.5,
    ratingBreakdown: {
      allowEntry: 5,
      largeDogFriendly: 5,
      outdoorSpace: 3,
      staffAttitude: 4,
      petFacilities: 5,
      userFeedback: 4,
    },
    verification: {
      status: 'phone',
      phoneConfirmedAt: '2026-01-20',
      lastUpdated: '2026-01-20',
      summary: '电话确认：提供广州-深圳-香港跨城跨境宠物运输，配备专业宠物转运笼和空调车厢，全程实时GPS定位共享给主人。',
    },
    petRules: {
      canEnterIndoor: true,
      largeDogAllowed: true,
      leashRequired: false,
      appointmentRequired: true,
      notes: '需提前3天预约，提供宠物健康证明和疫苗记录。跨境需额外办理相关手续，可协助办理。',
    },
    address: '广州市（覆盖穗深港三城）',
    priceRange: '¥200-800/次（视距离）',
    description: '爪子宠物运输专注跨城跨境宠物安全运输，具备专业运输资质。配备大型空调厢式货车，全程GPS定位，确保毛孩子舒适安全抵达目的地。',
    phone: '138-xxxx-xxxx',
    wechat: 'paws_transport_gz',
    warning: undefined,
  },
]
