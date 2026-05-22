import Link from 'next/link'
import { ArrowRight, CheckCircle2, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF4]">
      {/* Hero */}
      <div className="bg-[#1E1209] px-4 pt-10 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E0813D] flex items-center justify-center">
            <span className="text-white text-xl">🌱</span>
          </div>
          <div>
            <div className="font-bold text-white text-base">豆苗宠物友好</div>
            <div className="text-[10px] text-white/50 tracking-wide">DOUMIAO PET FRIENDLY</div>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          建立一个更透明、更可信的宠物友好信息平台
        </p>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DCCB]">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-[#E0813D]" />
            <h2 className="font-bold text-[#1E1209] text-sm">我们的使命</h2>
          </div>
          <p className="text-sm text-[#5C3D20] leading-relaxed">
            豆苗宠物友好希望建立一个更透明、更可信的宠物友好信息平台。我们会通过电话确认、实地探访、用户反馈和商家自提交，持续更新城市里的宠物友好信息。
          </p>
        </div>

        {/* What we do */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DCCB]">
          <h2 className="font-bold text-[#1E1209] text-sm mb-3">我们做什么</h2>
          <div className="space-y-2.5">
            {[
              '标准化广州/深圳/香港宠物友好场所信息',
              '通过多维度评分体系客观评估各商家',
              '持续电话/实地验证信息真实性',
              '为宠主提供可信赖的出行决策参考',
              '连接宠友好商家与宠物主用户群体',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#E0813D] shrink-0 mt-0.5" />
                <span className="text-sm text-[#5C3D20]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '9+', label: '收录地点' },
            { num: '3', label: '覆盖城市' },
            { num: '6', label: '评分维度' },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="bg-[#FFF8EE] border border-[#F5C49A] rounded-2xl p-3 text-center"
            >
              <div className="font-bold text-[#E0813D] text-xl">{num}</div>
              <div className="text-xs text-[#A07855]">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/partner"
          className="flex items-center justify-between bg-[#E0813D] text-white rounded-2xl p-4"
        >
          <div>
            <div className="font-bold text-base mb-0.5">成为认证商家</div>
            <div className="text-sm text-white/80">免费入驻，获得官方认证</div>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  )
}
