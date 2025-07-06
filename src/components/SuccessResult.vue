<template>
  <div class="result-box success">
    <h4>✅ API Test Successful!</h4>
    <p><strong>Message:</strong> {{ message }}</p>
    <p v-if="shops !== undefined"><strong>Shops:</strong> {{ shops }}</p>
    <p v-if="firstShopName"><strong>First Shop:</strong> {{ firstShopName }}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    shops: {
      type: [String, Number],
      required: false,
      default: undefined
    },
    firstShopName: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>
.result-box.success {
  background-color: #e6f7e6;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}
</style>