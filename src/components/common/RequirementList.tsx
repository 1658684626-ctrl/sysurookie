import { CheckCircle2, CircleAlert } from 'lucide-react'

interface RequirementListProps {
  missingRequirements: string[]
}

export function RequirementList({ missingRequirements }: RequirementListProps) {
  if (missingRequirements.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">资料已满足提交审核条件</p>
          <p className="mt-1 text-emerald-700">可以提交给赛事工作人员审核。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex items-start gap-3">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">还需要补充以下内容</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {missingRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
