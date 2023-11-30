import { defineStore } from 'pinia'

export const useAuthStore = defineStore('admin', {
  state: () => ({
    adminId: null,
    accessToken: null
  }),
  actions: {
    setAdminId(id) {
      this.adminId = id
    },
    setAccessToken(token) {
      this.accessToken = token
    }
  }
})
