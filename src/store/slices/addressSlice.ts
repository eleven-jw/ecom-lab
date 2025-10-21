import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Address } from '../../services/types'

export interface AddressState {
  addresses: Address[]
  selectedAddressId?: string
}

const defaultAddresses: Address[] = [
  {
    id: 'addr-1',
    label: '家',
    recipient: '张敏',
    phone: '13800000000',
    line1: '上海市浦东新区张江路 888 号',
    city: '上海',
    region: '上海',
    postalCode: '200120',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: '公司',
    recipient: '张敏',
    phone: '13800000001',
    line1: '上海市黄浦区外滩金融中心 188 号',
    city: '上海',
    region: '上海',
    postalCode: '200001',
  },
]

const initialState: AddressState = {
  addresses: defaultAddresses,
  selectedAddressId: defaultAddresses[0]?.id,
}

interface AddAddressPayload extends Omit<Address, 'id'> {}

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<AddAddressPayload>) {
      const newAddress: Address = {
        id: nanoid(),
        ...action.payload,
      }

      if (newAddress.isDefault) {
        state.addresses.forEach((address) => {
          address.isDefault = false
        })
      }

      state.addresses.push(newAddress)
      state.selectedAddressId = newAddress.id
    },
    selectAddress(state, action: PayloadAction<string>) {
      state.selectedAddressId = action.payload
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.addresses.forEach((address) => {
        address.isDefault = address.id === action.payload
      })
      state.selectedAddressId = action.payload
    },
  },
})

export const { addAddress, selectAddress, setDefaultAddress } = addressSlice.actions
export const addressReducer = addressSlice.reducer
