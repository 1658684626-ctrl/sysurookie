export function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-28 top-[-9rem] h-80 w-80 rounded-full bg-[#B6FF4D]/24 blur-3xl" />
      <div className="absolute right-[-9rem] top-20 h-96 w-96 rounded-full bg-[#A8BAC5]/30 blur-3xl" />
      <div className="absolute bottom-[-12rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#6C765F]/18 blur-3xl" />
      <div className="absolute inset-0 ee-grid-overlay opacity-50" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F8F6EF]/80 to-transparent" />
    </div>
  )
}
