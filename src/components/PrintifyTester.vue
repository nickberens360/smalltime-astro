<template>
  <div>
    <h3>Manual Client-Side Test</h3>
    <p>Click the button below to test the API by making a request from your browser.</p>
    <button @click="testAPI" :disabled="status === 'loading'">
      <span v-if="status === 'loading'">🔄 Testing...</span>
      <span v-else>🔄 Test API Now</span>
    </button>

    <ApiResult
      :status="status"
      :data="resultData"
      :error-message="errorMessage"
    />

    <details v-if="status === 'success' && resultData.data" style="margin-top: 1rem;">
      <summary>View Full Client Response</summary>
      <pre>{{ JSON.stringify(resultData.data, null, 2) }}</pre>
    </details>
  </div>
</template>

<script>
import ApiResult from './ApiResult.vue';

export default {
  components: {
    ApiResult,
  },
  data() {
    return {
      status: 'idle',
      resultData: {},
      errorMessage: '',
    };
  },
  methods: {
    async testAPI() {
      this.status = 'loading';
      this.resultData = {};
      this.errorMessage = '';

      try {
        const response = await fetch('/api/test-printify');
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'The API returned an error.');
        }

        this.resultData = {
          message: data.message,
          shops: data.shops,
          firstShopName: data.firstShopName,
          data: data.data // Store the full response
        };
        this.status = 'success';
      } catch (err) {
        this.errorMessage = err instanceof Error ? err.message : String(err);
        this.status = 'error';
      }
    },
  },
};
</script>

<style scoped>
button {
  background: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}
button:hover {
  background: #1d4ed8;
}
button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
pre {
  background: #f5f5f5;
  padding: 1rem;
  overflow: auto;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>