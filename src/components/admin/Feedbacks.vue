<template>
  <div class="mt-6 w-100">
    <v-card variant="text" class="new-feedback-card" height="100%">
      <v-container>
        <div class="head">
          <v-icon color="blue" size="large">mdi-message</v-icon>
          <v-card-title class="table-header">Feedbacks</v-card-title>
        </div>
        <template v-for="(feedback, index) in displayedFeedbacks" :key="index">
          <v-card variant="tonal" class="mb-4">
            <v-card-text>
              <div>
                <h5>{{ feedback.message }}</h5>
              </div>
              <v-divider :thickness="1" class="border-opacity-100" color="info"></v-divider>
              <div class="mt-1">
                <span style="font-size: 18px; color: grey">{{ feedback.fullName }}</span>
              </div>
              <div class="feedback-footer">
                <v-chip
                  class="mr-3"
                  prepend-icon="mdi-briefcase"
                  size="small"
                  variant="outlined"
                  dense
                >
                  {{ feedback.job_description }}
                </v-chip>

                <v-chip
                  class="mr-3"
                  prepend-icon="mdi-calendar"
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  {{ formatDate(feedback.date_created) }}
                </v-chip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon color="red" size="24" @click="deleteFeedback(index)" v-bind="props"
                      >mdi-delete</v-icon
                    >
                  </template>
                  <span>Delete</span>
                </v-tooltip>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      class="ml-3"
                      color="green"
                      size="24"
                      @click="postFeedback(index)"
                      v-bind="props"
                    >
                      mdi-check
                    </v-icon>
                  </template>
                  <span>Post as Testimonial</span>
                </v-tooltip>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-container>
    </v-card>
  </div>
  <v-dialog v-model="dialog" max-width="300">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>Are you sure you want to post this feedback as a testimonial?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="confirmPostTestimonial()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar">{{ snackbarMessage }}</v-snackbar>
</template>

<script>
import {
  getAllFeedbacks,
  deleteFeedback,
  postFeedbackAsTestimonial
} from '../../apirequests/feedback'

export default {
  data() {
    return {
      displayedFeedbacks: [],
      snackbar: false,
      snackbarMessage: '',
      dialog: false,
      selectedFeedbackId: null
    }
  },
  async created() {
    try {
      const response = await getAllFeedbacks()
      const feedbacks = response.data
      this.displayedFeedbacks = feedbacks.sort((a, b) => {
        return new Date(b.date_created) - new Date(a.date_created)
      })
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })
        return formattedDate.replace(/\//g, '-')
      }
      return '-'
    },
    async deleteFeedback(index) {
      try {
        const feedbackId = this.displayedFeedbacks[index]._id
        await deleteFeedback(feedbackId)
        this.displayedFeedbacks.splice(index, 1)
        this.snackbarMessage = 'The feedback has been successfully deleted.'
        this.snackbar = true
      } catch (error) {
        console.error(error)
      }
    },
    postFeedback(index) {
      const posted = this.displayedFeedbacks[index].isPosted
      if (posted === true) {
        this.snackbarMessage = 'Failed to post as testimonial: Feedback is already posted'
        this.snackbar = true
        return
      }
      this.dialog = true
      const feedbackId = this.displayedFeedbacks[index]._id
      this.selectedFeedbackId = feedbackId
      alert(this.selectedFeedbackId)
    },
    async confirmPostTestimonial() {
      try {
        const id = this.selectedFeedbackId
        alert(id)
        await postFeedbackAsTestimonial(id)
        this.snackbarMessage = 'Feedback posted as testimonial.'
        this.snackbar = true

        this.dialog = false
        this.selectedFeedbackId = null
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
}
.feedback-footer {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 10px;
}
</style>
