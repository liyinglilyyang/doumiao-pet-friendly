import Link from 'next/link'
import { ArrowRight, CheckCircle2, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF4] pb-20 md:pb-0">
      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EDE8E0]">
        <div className="max-w-screen-xl mx-auto w-full px-8 h-[64px] flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-[#1E1209] text-[15px]">豆苗宠物友好</span>
          </Link>
          <div className="ml-auto flex items-center gap-5">
            <Link href="/places" className="text-[13px] text-[#7C5A42] font-medium hover:text-[#1E1209]">探索地点</Link>
            <Link href="/partner" className="text-[13px] px-3.5 py-1.5 rounded-xl bg-[#1E1209] text-white hover:bg-[#3A2518] font-medium">商家入驻</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1E1209] px-4 md:px-8 pt-10 pb-8 md:py-16">
        <div className="max-w-2xl md:mx-auto">
          <div className="flex items-center gap-2 mb-4 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#E0813D] flex items-center justify-center">
              <span className="text-white text-xl">🌱</span>
            </div>
            <div>
              <div className="font-bold text-white text-base">豆苗宠物友好</div>
              <div className="text-[10px] text-white/50 tracking-wide">DOUMIAO PET FRIENDLY</div>
            </div>
          </div>
          <h1 className="hidden md:block text-[36px] font-bold text-white mb-3">关于豆苗</h1>
          <p className="text-white/80 text-[14px] md:text-[16px] leading-relaxed">
            建立一个更透明、更可信的宠物友好信息平台
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-2xl md:mx-auto space-y-5">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E8DCCB]">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-[#E0813D]" />
            <h2 className="font-bold text-[#1E1209] text-[14px] md:text-[16px]">我们的使命</h2>
          </div>
          <p className="text-[13px] md:text-[14px] text-[#5C3D20] leading-relaxed">
            豆苗宠物友好希望建立一个更透明、更可信的宠物友好信息平台。我们会通过电话确认、实地探访、用户反馈和商家自提交，持续更新城市里的宠物友好信息。
          </p>
        </div>

        {/* What we do */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E8DCCB]">
          <h2 className="font-bold text-[#1E1209] text-[14px] md:text-[16px] mb-3">我们做什么</h2>
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
                <span className="text-[13px] md:text-[14px] text-[#5C3D20]">{item}</span>
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
            <div key={label} className="bg-[#FFF8EE] border border-[#F5C49A] rounded-2xl p-3 md:p-4 text-center">
              <div className="font-bold text-[#E0813D] text-xl md:text-2xl">{num}</div>
              <div className="text-[11px] md:text-[12px] text-[#A07855] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/partner"
          className="flex items-center justify-between bg-[#E0813D] text-white rounded-2xl p-4 md:p-5 hover:bg-[#CC7030] transition-colors"
        >
          <div>
            <div className="font-bold text-[15px] md:text-[16px] mb-0.5">成为认证商家</div>
            <div className="text-[13px] text-white/80">免费入驻，获得官方认证</div>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  )
}
