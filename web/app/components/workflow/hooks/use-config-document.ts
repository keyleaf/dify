import { produce } from 'immer'
import { useCallback } from 'react'
import { useIsChatMode } from './use-workflow'
import type { ModelConfig, DocumentSetting } from '@/app/components/workflow/types'
import { useTextGenerationCurrentProviderAndModelAndModelList } from '@/app/components/header/account-setting/model-provider-page/hooks'
import {
  ModelFeatureEnum,
} from '@/app/components/header/account-setting/model-provider-page/declarations'

type Payload = {
  enabled: boolean
  configs?: DocumentSetting
}

type Params = {
  payload: Payload
  onChange: (payload: Payload) => void
}
const useConfigDocument = (model: ModelConfig, {
  payload = {
    enabled: false,
  },
  onChange,
}: Params) => {
  const {
    currentModel: currModel,
  } = useTextGenerationCurrentProviderAndModelAndModelList(
    {
      provider: model.provider,
      model: model.name,
    },
  )

  const isChatMode = useIsChatMode()

  const getIsDocumentModel = useCallback(() => {
    return !!currModel?.features?.includes(ModelFeatureEnum.document)
  }, [currModel])

  const isDocumentModel = getIsDocumentModel()

  const handleDocumentEnabledChange = useCallback((enabled: boolean) => {
    const newPayload = produce(payload, (draft) => {
      draft.enabled = enabled
      if (enabled && isChatMode) {
        draft.configs = {
          variable_selector: ['sys', 'files'],
        }
      }
    })
    onChange(newPayload)
  }, [isChatMode, onChange, payload])

  const handleDocumentConfigChange = useCallback((config: DocumentSetting) => {
    const newPayload = produce(payload, (draft) => {
      draft.configs = config
    })
    onChange(newPayload)
  }, [onChange, payload])

  const handleModelChanged = useCallback(() => {
    const isDocumentModel = getIsDocumentModel()
    if (!isDocumentModel) {
      handleDocumentEnabledChange(false)
      return
    }
    if (payload.enabled) {
      onChange({
        enabled: true,
        configs: {
          variable_selector: [],
        },
      })
    }
  }, [getIsDocumentModel, handleDocumentEnabledChange, onChange, payload.enabled])

  return {
    isDocumentModel,
    handleDocumentEnabledChange,
    handleDocumentConfigChange,
    handleModelChanged,
  }
}

export default useConfigDocument

