import { Cascader } from 'antd'
import type { CascaderProps } from 'antd'

import { regions } from '../../data/regions'
import type { RegionNode } from '../../data/regions'

export interface RegionValue {
  province: string
  city: string
  district: string
}

interface RegionCascaderProps extends Omit<CascaderProps, 'options' | 'onChange' | 'value'> {
  value?: RegionValue
  onChange?: (value: RegionValue | undefined) => void
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

export function RegionCascader({ value, onChange, ...props }: RegionCascaderProps) {
  const cascaderValue = value ? findValuePath(regions, value) : undefined

  return (
    <Cascader
      {...props}
      options={regions}
      placeholder="请选择省 / 市 / 区"
      showSearch
      allowClear
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
