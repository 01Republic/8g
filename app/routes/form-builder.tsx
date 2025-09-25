import { type IntegrationAppFormMetadata } from '~/models/integration/apps/IntegrationAppFormMetadata'
import type { Route } from './+types/form-builder'
import { IntegrationAppFormMetadata as IntegrationAppFormMetadataEntity } from '~/.server/db/entities/IntegrationAppFormMetadata'
import { initializeDatabase } from '~/.server/db'
import FormBuilderPage from '~/client/admin/formBuilder/FormBuilderPage'
import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'

export async function loader({ params }: Route.LoaderArgs) {
  await initializeDatabase()
  const integrationAppFormMetadata = await IntegrationAppFormMetadataEntity.findOne({ where: { productId: parseInt(params.appId) } })

  if (!integrationAppFormMetadata) {
    return { appId: params.appId, initialMeta: { sections: [] } as IntegrationAppFormMetadata }
  }

  return { appId: params.appId, initialMeta: integrationAppFormMetadata.meta as unknown as IntegrationAppFormMetadata }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const appId = formData.get('appId') as string
  const meta = formData.get('meta') as string
  const isActiveStr = formData.get('isActive') as string | null
  const isActive = isActiveStr === 'true'

  await initializeDatabase()
  const isUpdate = await IntegrationAppFormMetadataEntity.findOne({ where: { productId: parseInt(appId) } })
  if (isUpdate) {
    await IntegrationAppFormMetadataEntity.update({ productId: parseInt(appId) }, { meta: JSON.parse(meta), isActive })
  } else {
    await IntegrationAppFormMetadataEntity.save({ productId: parseInt(appId), meta: JSON.parse(meta), isActive })
  }
  
  return {
    message: 'Success',
  }
}

export default function FormBuilder(
  { loaderData }: Route.ComponentProps
) {
  const { appId, initialMeta } = loaderData

  const fetcher = useFetcher()
  const isSaving = fetcher.state !== 'idle'
  const [saveDialog, setSaveDialog] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' })

  const onSave = ({ appId, meta, isActive }: { appId: string; meta: IntegrationAppFormMetadata; isActive: boolean }) => {
    const formData = new FormData()
    formData.append('appId', appId)
    formData.append('meta', JSON.stringify(meta))
    formData.append('isActive', String(isActive))
    fetcher.submit(formData, { method: 'POST' })
  }

  useEffect(() => {
    if (fetcher.state !== 'idle') return
    if (!fetcher.data) return
    const data = fetcher.data as any
    const hasError = data && typeof data === 'object' && 'error' in data
    setSaveDialog({
      open: true,
      title: hasError ? '저장 실패' : '저장 완료',
      message: hasError ? (data?.error as string) || '저장 중 오류가 발생했습니다.' : '메타데이터가 저장되었습니다.',
    })
  }, [fetcher.state, fetcher.data])

  const onCloseDialog = () => setSaveDialog((p) => ({ ...p, open: false }))

  return (
    <FormBuilderPage
      appId={appId}
      initialMetadata={initialMeta as unknown as IntegrationAppFormMetadata}
      onSave={onSave}
      isSaving={isSaving}
      saveDialog={saveDialog}
      onCloseDialog={onCloseDialog}
    />
  )
}