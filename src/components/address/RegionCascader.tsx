import type { CSSProperties } from 'react'
import { Cascader } from 'antd'
import { useTranslation } from 'react-i18next'

import { regions } from '../../data/regions'
import type { RegionNode } from '../../data/regions'

export interface RegionValue {
  province: string
  city: string
  district: string
}

interface RegionCascaderProps {
  value?: RegionValue
  onChange?: (value: RegionValue | undefined) => void
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

const findValuePath = (nodeList: RegionNode[], target: RegionValue): string[] | undefined => {
  for (const province of nodeList) {
    if (province.label !== target.province) continue
    for (const city of province.children ?? []) {
      if (city.label !== target.city) continue
      for (const district of city.children ?? []) {
        if (district.label === target.district) {
          return [province.value, city.value, district.value]
        }
      }
    }
  }
  return undefined
}

export function RegionCascader({ value, onChange, disabled, className, style }: RegionCascaderProps) {
  const { t } = useTranslation()
  const cascaderValue = value ? findValuePath(regions, value) : undefined

  return (
    <Cascader
      options={regions}
      placeholder={t('components.regionCascader.placeholder')}
      showSearch
      allowClear
      disabled={disabled}
      className={className}
      style={style}
      value={cascaderValue}
      onChange={(values, selectedOptions) => {
        if (!values || values.length !== 3 || !selectedOptions) {
          onChange?.(undefined)
          return
        }
        onChange?.({
          province: selectedOptions[0]?.label as string,
          city: selectedOptions[1]?.label as string,
          district: selectedOptions[2]?.label as string,
        })
      }}
    />
  )
}

export default RegionCascader
