import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { getActiveTab } from '../selectors/chat'
import { Notification } from '../types/chat'

const notificationSlice = createSlice({
  name: 'notifications',

  initialState: {
    active: [] as Notification[],
    index: 0
  },

  reducers: {
    receive (state, action: PayloadAction<Notification>) {
      state.active.push({
        ...action.payload,
        id: state.index
      })
      state.index += 1
    },

    close (state, action: PayloadAction<number>) {
      state.active = state.active.filter(notification => notification.id !== action.payload)
    }
  },

  extraReducers: {
    DidLogout (state) {
      state.active = []
      state.index = 0
    },

    UserWasKicked (state) {
      state.active = []
      state.index = 0
    }
  }
})

export default notificationSlice.reducer

export const { receive, close } = notificationSlice.actions

export const selectNotifications = (state: any): Notification[] => state.notifications.active

export const selectShouldDisplayNotifications = createSelector(
  [
    selectNotifications,
    getActiveTab
  ],
  (notifications, activeTab) => notifications.length > 0 || activeTab === 'notifications'
)
