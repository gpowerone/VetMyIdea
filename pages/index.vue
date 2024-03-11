<template>
    <v-container class="wizard" :class="{'wizard-mobile': !($vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl)}" fluid>
          
      <h1 class='text-center mt-15'>Coming April 9th, 2024!</h1>

      <h2 class="mt-10 mb-5 text-center">Get <b>free</b> information about your business idea</h2>

      <p class="text-center mt-10" style='font-size:1.2em;'>Evaluate it <em>before</em> you start. Save time and money! Get a <span style='color:#a32d26;font-weight:bold;'>Vet My Idea Report</span>:</p>

      <div class='mt-5 mb-15' style='text-align:center;'>
         <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
            <li>Report based on targeted location (city, region, country, or international)</li>
            <li>Expected growth in your industry</li>
            <li>Potential competitors</li>
            <li>Potential risks</li>
            <li>Validation of unique feature/value-proposition</li>
            <li>Validation of cost-cutting measures</li>
            <li>Favorability score</li>    
            <li>Keep your report private or share it publically</li>
            <li>Run a report in under 5 minutes</li>
            <li>No waitlist! Vet My Idea will be fully-functional on launch day</li>
         </ul>
      </div>

      <p class='text-center' style='font-size:1.2em;'><b>Want all the latest updates?</b> Join us on <a href='https://discord.gg/4ABJy6n4'>Discord</a> or <a href='/contact'>Contact Us</a></p>

       <!-- 
       <div class="panel" v-if="panelOpt==0">
        <h2 class="mt-15 mb-15 text-center">Get <b>free</b> information about your business idea</h2>
        <monetize v-on:advancePanel="advancePanel" />
       </div>
       <div class="panel" v-if="panelOpt==1" >
        <locality v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" />
       </div>
       <div class="panel" v-if="panelOpt==2" >
        <differentiators v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" /> 
       </div>
       <div class="panel" v-if="panelOpt==3" >
          <div v-if="store.state.isLoggedIn===true">
            <summarycomp v-on:backPanel="backPanel" />
          </div>
          <div v-else>
            <login v-on:backPanel="backPanel"  />
          </div>
       </div>
      //-->

       <hr class="bottom-border mt-15" />

       <div class="mt-7 text-center">
          <div v-if="panelOpt<3">
            Vet My Idea will not sell any data about your idea to third parties<!--, in accordance with our <a href='/privacy' rel="noopener noreferrer" target='_blank'>Privacy Policy</a>//-->    
          </div>
          <!--
          <div v-else>
            By creating an account, logging in, or creating a report you agree to our 
            <a href='/privacy' rel="noopener noreferrer" target='_blank'>Privacy Policy</a> and 
            <a href='/terms' rel="noopener noreferrer" target='_blank'>Terms of Service</a>
          </div>//-->
          <div class='mt-2'>This tool is for information purposes only. Its output is not advice of <em>any kind</em>. Use at your own risk</div>
       </div>

  </v-container>
</template>

<script setup>
import login from '../components/login.vue'
import monetize from '../components/monetize.vue'
import locality from '../components/locality.vue'
import differentiators from '../components/differentiators.vue'
import summarycomp from '../components/summary.vue'
import { ref, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'

const store = useStore();
let panelOpt=ref(0);

watch(panelOpt, async (newValue) => {
    localStorage.setItem("panelOpt", newValue)
});

function advancePanel() {
   panelOpt.value++;
   if (panelOpt>0) {
      this.$store.state.showLogo=true;
   }
}

function backPanel() {
   panelOpt.value--;
   if (panelOpt===0) {
      this.$store.state.showLogo=false;
   }
}

onMounted(() => {
  let stored_panel = localStorage.getItem("panelOpt");
  if (stored_panel!==null) {
      panelOpt.value=stored_panel;
  }
})
</script>

<style>
  .bottom-border {
     border-top:1px dashed #0c1d36;
  }
  .market-list {
     font-size:1.2em;
     display: inline-block;
    text-align: left;
  }
  .wizard {
      width:60%;
      margin-left:20%;
  }
  .wizard-mobile {
      width:95%;
      margin-left:2.5%;
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
  }
</style>