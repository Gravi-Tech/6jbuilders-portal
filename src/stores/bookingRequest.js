import { defineStore } from 'pinia';

export const useBookingRequestStore = defineStore('bookingRequest', {
  state: () => ({
    requestData: null,
  }),
  actions: {
    setBookingRequestData(data) {
      this.requestData = data;
    },
  },
});