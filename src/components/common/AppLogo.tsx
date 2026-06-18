export function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] border border-black/10 bg-[var(--ee-deep-olive)] text-[#F8F6EF] shadow-[0_18px_34px_rgba(51,70,45,0.22)]">
        <div className="absolute inset-1 rounded-[1.05rem] border border-[#B6FF4D]/35" />
        <span className="relative text-base font-black tracking-tight">EE</span>
        <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#F8F6EF] bg-[#B6FF4D] shadow-[0_0_18px_rgba(182,255,77,0.8)]" />
      </div>
      <div>
        <p className="font-mono-ui text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ee-muted)]">
          EasyEvent
        </p>
        <p className="font-editorial text-xl font-semibold text-[var(--ee-text)]">易赛通</p>
      </div>
    </div>
  )
}
