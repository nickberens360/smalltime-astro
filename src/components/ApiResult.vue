<template>
  <div>
    <LoadingResult v-if="status === 'loading'" />
    <SuccessResult
      v-else-if="status === 'success'"
      :message="data.message"
      :shops="data.shops"
      :firstShopName="data.firstShopName"
    />
    <ErrorResult
      v-else-if="status === 'error'"
      :errorMessage="errorMessage"
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
  }
}
</script>