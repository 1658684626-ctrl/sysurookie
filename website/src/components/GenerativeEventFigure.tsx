import { motion, useReducedMotion } from 'motion/react'

const nodes = [
  [16, 72], [24, 54], [34, 38], [48, 28], [63, 23], [78, 30], [88, 44],
  [78, 58], [63, 66], [48, 74], [34, 82], [22, 86], [43, 49], [55, 46],
  [66, 43], [58, 58], [47, 62], [37, 60], [72, 76], [84, 84], [18, 28],
] as const

const links = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [8, 9], [9, 10], [10, 11], [2, 12], [12, 13], [13, 14], [14, 7],
  [12, 15], [15, 16], [16, 17], [8, 18], [18, 19], [2, 20],
] as const

const signalBars = [
  { x: 18, y: 18, h: 18 },
  { x: 24, y: 14, h: 28 },
  { x: 30, y: 10, h: 38 },
  { x: 36, y: 18, h: 24 },
]

export function GenerativeEventFigure({ label, stat }: { label: string; stat: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative min-h-[34rem] overflow-hidden border border-black/30 bg-[#ebe7dc]"
    >
      <div className="ee-grid-paper absolute inset-0 opacity-70" />
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        role="img"
        aria-label="Abstract event signal graph"
      >
        <defs>
          <linearGradient id="route-acid" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#060606" />
            <stop offset="72%" stopColor="#00f06a" />
          </linearGradient>
        </defs>

        {links.map(([from, to], index) => {
          const [x1, y1] = nodes[from]
          const [x2, y2] = nodes[to]
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={index % 4 === 0 ? 'url(#route-acid)' : '#060606'}
              strokeOpacity={index % 4 === 0 ? 0.9 : 0.38}
              strokeWidth={index % 4 === 0 ? 0.42 : 0.22}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.02 }}
            />
          )
        })}

        {nodes.map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index % 5 === 0 ? 1.55 : 0.9}
            fill={index % 6 === 0 ? '#00f06a' : '#060606'}
            opacity={index % 6 === 0 ? 1 : 0.72}
            animate={
              reducedMotion
                ? undefined
                : {
                    scale: index % 6 === 0 ? [1, 1.28, 1] : [1, 1.08, 1],
                  }
            }
            transition={{ duration: 2.5 + index * 0.06, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <path
          d="M16 72 C30 42, 48 86, 66 43 S87 35, 84 84"
          fill="none"
          stroke="#00f06a"
          strokeWidth="0.75"
          strokeDasharray="2.2 2.2"
          strokeLinecap="round"
          opacity="0.82"
          vectorEffect="non-scaling-stroke"
        />

        {signalBars.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={bar.y}
            width="2.2"
            height={bar.h}
            fill="#060606"
            opacity="0.82"
          />
        ))}
      </motion.svg>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/25 bg-[#f5f3ee]/85 p-4 backdrop-blur">
        <div className="ee-mono flex items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-black">
          <span>{label}</span>
          <span className="text-[var(--ee-acid)]">{stat}</span>
        </div>
      </div>
    </motion.div>
  )
}
