<template>
  <NuxtLayout>
    <div>
        <p style='margin:25px;'>
            <strong>{{ error.message }}</strong>
        </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError();
</script>