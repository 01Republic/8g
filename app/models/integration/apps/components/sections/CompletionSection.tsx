import { useEffect } from 'react'
import { useConfetti } from '~/hooks/use-confetti'

export function CompletionSection() {
  const { triggerConfetti, confettiElement } = useConfetti()
  useEffect(() => { triggerConfetti() }, [triggerConfetti])
  return (
    <>
      {confettiElement}
      <div className="space-y-4 max-w-md mx-auto w-full text-center">
        <h3 className="text-lg font-semibold">🎉 연동 완료!</h3>
      </div>
    </>
  )
}



