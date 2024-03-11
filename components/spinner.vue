<template>
  <div v-if="isLoading" class="spinner"></div>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid blue;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
