import { useEffect, useState } from 'react'
import { EightGClient } from '8g-extension'
import { Button } from '~/components/ui/button'
import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'

interface InitialCheckStepProps {
  title: string
  onNext: () => void
}

export function InitialCheckStep({ title, onNext }: InitialCheckStepProps) {
  const [loading, setLoading] = useState(true)
  const [installed, setInstalled] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    try {
      setLoading(true)
      setError(null)
      const client = new EightGClient()
      const status = await client.checkExtension()
      const ok = !!(status as any)?.installed
      setInstalled(ok)
      if (ok) {
        const t = window.setTimeout(() => onNext(), 800)
        return () => window.clearTimeout(t)
      }
    } catch (e: any) {
      setError(e?.message || '확인 실패')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { run() }, [])

  return (
    <div className="space-y-6 max-w-md mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <CenteredSection>
        {loading && <LoadingCard message="8G Extension 확인 중..." icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} />}
        {!loading && error && <LoadingCard icon={<span className="text-lg">❌</span>} message={error} />}
        {!loading && !error && installed === true && (
          <LoadingCard icon={<span className="text-lg">✅</span>} message="8G Extension 설치됨" />
        )}
        {!loading && !error && installed === false && (
          <LoadingCard icon={<span className="text-lg">❌</span>} message="8G Extension이 설치되지 않았습니다" />
        )}
      </CenteredSection>
      {!loading && installed === false && (
        <div className="flex justify-end pt-2">
          <Button onClick={run} variant="outline" className="px-8 py-2">재시도</Button>
        </div>
      )}
    </div>
  )
}


