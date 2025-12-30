'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { produce } from 'immer'
import VarReferencePicker from './variable/var-reference-picker'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import Switch from '@/app/components/base/switch'
import { type ValueSelector, type Var, VarType, type DocumentSetting } from '@/app/components/workflow/types'
import Tooltip from '@/app/components/base/tooltip'
const i18nPrefix = 'workflow.nodes.llm'

type Props = {
  isDocumentModel: boolean
  readOnly: boolean
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  nodeId: string
  config?: DocumentSetting
  onConfigChange: (config: DocumentSetting) => void
}

const ConfigDocument: FC<Props> = ({
  isDocumentModel,
  readOnly,
  enabled,
  onEnabledChange,
  nodeId,
  config = {
    variable_selector: [],
  },
  onConfigChange,
}) => {
  const { t } = useTranslation()

  const filterVar = useCallback((payload: Var) => {
    return [VarType.file, VarType.arrayFile].includes(payload.type)
  }, [])

  const handleVarSelectorChange = useCallback((valueSelector: ValueSelector | string) => {
    const newConfig = produce(config, (draft) => {
      draft.variable_selector = valueSelector as ValueSelector
    })
    onConfigChange(newConfig)
  }, [config, onConfigChange])

  return (
    <Field
      title={t('appDebug.feature.documentUpload.title')}
      tooltip={t('appDebug.feature.documentUpload.description')!}
      operations={
        <Tooltip
          popupContent={t('appDebug.vision.onlySupportVisionModelTip', { defaultValue: 'Only document-supported models can use this feature' })!}
          disabled={isDocumentModel}
        >
          <Switch disabled={readOnly || !isDocumentModel} size='md' defaultValue={!isDocumentModel ? false : enabled} onChange={onEnabledChange} />
        </Tooltip>
      }
    >
      {(enabled && isDocumentModel)
        ? (
          <div>
            <VarReferencePicker
              className='mb-4'
              filterVar={filterVar}
              nodeId={nodeId}
              value={config.variable_selector || []}
              onChange={handleVarSelectorChange}
              readonly={readOnly}
            />
          </div>
        )
        : null}

    </Field>
  )
}
export default React.memo(ConfigDocument)

