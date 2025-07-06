<template>
  <div>
    <LoadingResult v-if="currentStatus === 'loading'" />
    <SuccessResult
      v-else-if="currentStatus === 'success'"
      :message="currentData.message"
      :shops="currentData.shops"
      :firstShopName="currentData.firstShopName"
    />
    <ErrorResult
      v-else-if="currentStatus === 'error'"
      :errorMessage="currentErrorMessage"
    />
  </div>
</template>

<script>
import LoadingResult from './LoadingResult.vue';
import SuccessResult from './SuccessResult.vue';
import ErrorResult from './ErrorResult.vue';

export default {
  components: {
    LoadingResult,
    SuccessResult,
    ErrorResult
  },
  props: {
    status: {
      type: String,
      required: true,
      validator: value => ['idle', 'loading', 'success', 'error'].includes(value)
    },
    data: {
      type: Object,
      default: () => ({})
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      // Initialize local data from props
      currentStatus: this.status,
      currentData: this.data,
      currentErrorMessage: this.errorMessage,
      // Store the event handler function so we can remove it later
      updateStatusHandler: null
    };
  },

  mounted() {
    // Create the event handler function and store it
    this.updateStatusHandler = (event) => {
      // Update the local data from the event detail
      this.currentStatus = event.detail.status;
      this.currentData = event.detail.data;
      this.currentErrorMessage = event.detail.errorMessage;
    };

    // Add the event listener
    this.$el.addEventListener('update-status', this.updateStatusHandler);
  },

  beforeUnmount() {
    // Clean up the event listener with the same function reference
    if (this.updateStatusHandler) {
      this.$el.removeEventListener('update-status', this.updateStatusHandler);
    }
  },

  watch: {
    // Watch for changes to props and update local data
    status(newValue) {
      this.currentStatus = newValue;
    },
    data(newValue) {
      this.currentData = newValue;
    },
    errorMessage(newValue) {
      this.currentErrorMessage = newValue;
    }
  }
}
</script>
