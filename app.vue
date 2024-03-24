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
  .v-data-table-header__content span {
    font-weight:bold;
  }
  .field-error .v-input__control {
     border:1px solid #a32d26;
  }
  .inset {
     font-size:0.8em;
  }
  .fullheight {
     height:100%;
  }
  .fullwidth {
     width:100%;
  }
  .next-btn {
     border-radius:50%!important;
     height:52px!important;
     width:52px!important;
     max-width:52px!important;
     min-width:52px!important;
     display:inline-block;
     border:2px solid #FFF;
     background: #0c1d36;
     font-size:1.1em;
  }
  .tooltip {
     height: 25px;
     width: 25px;
     background-color: #0c1d36;
     color:#FFF;
     text-align:center;
     font-weight:bold;
     border:2px solid #FFF;
     border-radius: 50%;
     display: inline-block;
  }
  .v-popper__inner { max-width: 360px !important; }
  .v-field__outline {
      display:none;
  }
</style>