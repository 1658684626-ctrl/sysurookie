interface CodeCardProps {
  code: string
  label?: string
}

export function CodeCard({ code, label = '检录码' }: CodeCardProps) {
  return (
    <div className="ee-scanline ee-grid-overlay relative rounded-3xl border border-emerald-300/35 bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 p-5 text-white shadow-[0_0_48px_rgba(16,185,129,0.18)]">
      <div className="absolute right-5 top-5 rounded-full border border-cyan-200/35 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
        EVENT PASS
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">
        {label}
      </p>
      <p className="mt-5 break-all font-mono text-3xl font-black tracking-[0.16em] text-cyan-50 drop-shadow-[0_0_18px_rgba(103,232,249,0.45)]">
        {code}
      </p>
      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />
      <p className="mt-4 text-xs leading-5 text-slate-300">
        当前为系统生成的检录码。现场检录由工作人员在管理端完成，后续可升级为真实二维码。
      </p>
    </div>
  )
}
