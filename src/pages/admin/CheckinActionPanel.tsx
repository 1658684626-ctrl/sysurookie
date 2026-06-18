import { useState } from 'react'
import { PrimaryButton } from '../../components/common/PrimaryButton'
import type { Registration } from '../../types/registration'
import { findRegistrationByCheckinCode } from '../../utils/checkin'

interface CheckinActionPanelProps {
  registrations: Registration[]
  onCheckIn: (registrationId: string) => void
}

export function CheckinActionPanel({
  registrations,
  onCheckIn,
}: CheckinActionPanelProps) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = () => {
    const registration = findRegistrationByCheckinCode(code, registrations)

    if (!registration) {
      setMessage('未找到对应报名，请检查检录码或报名编号。')
      return
    }

    if (registration.status !== 'registered') {
      setMessage('该报名尚未进入正式名单，不能签到。')
      return
    }

    if (registration.checkinStatus === 'checked_in') {
      setMessage('该报名已签到。')
      return
    }

    if (registration.checkinStatus === 'departed') {
      setMessage('该报名已出发。')
      return
    }

    onCheckIn(registration.id)
    setCode('')
    setMessage('检录签到完成。')
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        检录码
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="输入报名编号或签到码"
          className="mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </label>
      <PrimaryButton disabled={!code.trim()} onClick={handleSubmit}>
        检录签到
      </PrimaryButton>
      {message && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  )
}
