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
    line1: '张江路 888 号 3 号楼 2201 室',
    city: '浦东新区',
    region: '上海市',
    district: '张江街道',
    postalCode: '200120',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: '公司',
    recipient: '张敏',
    phone: '13800000001',
    line1: '外滩金融中心 188 号 35 楼',
    city: '黄浦区',
    region: '上海市',
    district: '南京东路街道',
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
      if (state.addresses.length >= 25) {
        throw new Error('ADDRESS_LIMIT_REACHED')
      }

      const newAddress: Address = {
        id: nanoid(),
        ...action.payload,
      }

      if (!state.addresses.length) {
        newAddress.isDefault = true
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
    updateAddress(state, action: PayloadAction<{ id: string } & AddAddressPayload>) {
      const { id, ...payload } = action.payload
      const index = state.addresses.findIndex((address) => address.id === id)
      if (index === -1) return

      const updated: Address = {
        id,
        ...payload,
      }
      const wasDefault = state.addresses[index].isDefault

      if (updated.isDefault) {
        state.addresses.forEach((address) => {
          address.isDefault = address.id === updated.id
        })
      } else if (wasDefault) {
        updated.isDefault = true
        state.addresses.forEach((address) => {
          if (address.id !== updated.id) {
            address.isDefault = false
          }
        })
      }

      state.addresses[index] = updated
      state.selectedAddressId = updated.id
    },
    deleteAddress(state, action: PayloadAction<string>) {
      const filtered = state.addresses.filter((address) => address.id !== action.payload)
      if (filtered.length === state.addresses.length) return

      state.addresses = filtered

      if (!state.addresses.length) {
        state.selectedAddressId = undefined
        return
      }

      if (state.selectedAddressId === action.payload) {
        state.selectedAddressId = state.addresses[0].id
      }

      if (!state.addresses.some((address) => address.isDefault)) {
        state.addresses[0].isDefault = true
      }
    },
  },
})

export const { addAddress, selectAddress, setDefaultAddress, updateAddress, deleteAddress } = addressSlice.actions
export const addressReducer = addressSlice.reducer
