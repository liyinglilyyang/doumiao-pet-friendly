import BottomNav from '@/components/BottomNav'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-20">
      <div className="max-w-[480px] mx-auto min-h-screen">{children}</div>
      <div className="max-w-[480px] mx-auto">
        <BottomNav />
      </div>
    </div>
  )
}
