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
   @font-face {
      font-family: 'AbrilFatface';
      src: url('./AbrilFatface.ttf') format('ttf');
   }
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
  .field.fielderror .v-field__input {
     background-color: rgb(163,45,38, 0.2)!important;
  }
  .wizard .field.fielderror .v-field {
       border:1px solid rgb(163,45,38, 0.4);
      border-radius:0%;
      -moz-box-shadow: 1px 2px 3px rgba(163,45,38,.3);
      -webkit-box-shadow: 1px 2px 3px rgba(163,45,38,.3);
      box-shadow: 1px 2px 3px rgba(163,45,38,.3);
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
  .wizard button {
      background-color: #0c1d36;
      color:#FFF;
  }
  .wizard .field {
      border: 1px solid #0c1d36;
      background: #FFF;
  }
  .wizard .field-select {
      border-radius: 10px;
      border: 1px solid #0c1d36;
      background: #FFF;
  }
  .v-field__overlay {
      display:none;
  }
  .wizard .field .v-field:hover {
      border:1px solid rgb(0,0,139, 0.4);
      border-radius:0%;
      -moz-box-shadow: 1px 2px 3px rgba(0,0,139,.3);
      -webkit-box-shadow: 1px 2px 3px rgba(0,0,139,.3);
      box-shadow: 1px 2px 3px rgba(0,0,139,.3);
  }
</style>