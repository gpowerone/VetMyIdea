<template>
  <NuxtLayout>
      <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
   :root {
        --v-high-emphasis-opacity: 1 !important;
        --v-medium-emphasis-opacity: 1 !important;
        --v-low-emphasis-opacity: 1 !important;
   }
</style>

<style>
  a {
    color:#a32d26;
    text-decoration:underline;
  }
  h2 {
     font-size:2em;
     font-weight:100;
  }
  h2 b {
     font-weight:600;
  }
  hr {
    border-top:1px solid #0c1d36;
  }
  .field-error .v-input__control {
     border:1px solid #a32d26;
  }
  .inset {
     font-size:0.8em;
  }
  .next-btn {
     border-radius:50%;
     height:60px!important;
     width:60px!important;
     border:2px solid #FFF;
     background: #0c1d36;
     font-size:1.3em;
  }
  .v-field__outline {
      display:none;
  }
</style>