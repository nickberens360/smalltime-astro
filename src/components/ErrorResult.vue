<template>
  <div class="result-box error">
    <h4>❌ API Test Failed</h4>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.result-box.error {
  background-color: #ffebee;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}
</style>