<template>
    <v-container class="wizard"  fluid>
      <v-row v-if="panelOpt==0">
        <v-col>
            <h2 class="mt-10 text-center">Get a <b>free</b> evaluation of your business idea</h2>
        </v-col>
      </v-row>
      <v-row>
         <v-col cols="12" lg="3" xs="12" v-if="panelOpt>0" class="d-none d-sm-flex">&nbsp;</v-col>
         <v-col cols="12" lg="6" xs="12" >


            <div class="panel mt-5" :class="{'centered':$vuetify.display.md||$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl,'mt-10':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}" v-if="panelOpt==0">
               <h3>What will you sell?</h3>
               <monetize v-on:advancePanel="advancePanel" />
            </div>
             
            <div class="panel" v-if="panelOpt==1"  >
               <locality v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" />
            </div>
            <div class="panel" v-if="panelOpt==2" >
               <div v-if="store.state.isLoggedIn===true">
                  <summarycomp v-on:backPanel="backPanel" />
               </div>
               <div v-else>
                  <login v-on:backPanel="backPanel" :loadBack="true"  />
               </div>
            </div>

        </v-col>
        <v-col cols="12" lg="5" xs="12" v-if="panelOpt==0" >
            
            <p class="text-center mt-10"  style='font-size:1.6em;'><b>90%</b> of startups <b>fail</b>. Why yours could be next:</p>
            <div class='mt-5 mb-7' style='text-align:center;'>
               <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
                  <li>An unconvincing value proposition - customers buy your competitors product</li>
                  <li>Incorrect marketing strategy - customers don't know they need your product</li>
                  <li>Weak growth in your industry - no one wants your product</li> 
                  <li>Being unaware of risks</li>
                  <li>Your product is, unbeknownst to you, illegal</li>
               </ul>
            </div>

            <h3 class="text-center mt-15" style="font-size:1.6em;" >Evaluate it <em>before</em> you start. Get a <span style='color:#a32d26;font-weight:bold;'>VetMyIdea Report</span></h3>

            <div class='mt-5 mb-7' style='text-align:center;'>
               <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
                  <li>Potential growth and competitors in your industry</li>
                  <li>Potential risks</li>
                  <li>Evaluation of unique feature, cost-cutting, and marketing strategies</li>
                  <li>Report based on targeted location (city, region, country, or international)</li>
                  <li>VetMyIdea favorability score</li>    
                  <li>Run a report for free in under 5 minutes</li>
               </ul>
            </div>

             <p class='text-center mt-15'><a href="https://www.producthunt.com/products/vet-my-idea?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-vet&#0045;my&#0045;idea" target="_blank">
             <img src="/images/ph.svg"  alt="Vet&#0032;My&#0032;Idea - Get&#0032;a&#0032;free&#0032;evaluation&#0032;of&#0032;your&#0032;business&#0032;idea | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a></p>



        </v-col>
         <v-col cols="12" lg="1" xs="12" v-if="panelOpt==0" class="d-none d-sm-flex">&nbsp;</v-col>
      </v-row>
      <v-row>
         <v-col cols="12">
                  <hr class="bottom-border mt-15" />

            <div class="mt-7 text-center">
               <div v-if="panelOpt<3">
                  Vet My Idea will not sell any data about your idea to third parties, in accordance with our <a href='/privacy' rel="noopener noreferrer" target='_blank'>Privacy Policy</a>
               </div>
               <div v-else>
                  By creating an account, logging in, or creating a report you agree to our 
                  <a href='/privacy' rel="noopener noreferrer" target='_blank'>Privacy Policy</a> and 
                  <a href='/terms' rel="noopener noreferrer" target='_blank'>Terms of Service</a>
               </div>
               <div class='mt-2'>This tool is for information purposes only. Its output is not advice of <em>any kind</em>. Use at your own risk</div>
            </div>
         </v-col>
      </v-row>
  </v-container>

</template>

<script setup>
import monetize from '../components/monetize.vue'
import locality from '../components/locality.vue'
import login from '../components/login.vue'
import summarycomp from '../components/summary.vue'
import { ref, watch, defineEmits } from 'vue'
import { useStore } from 'vuex'

const store = useStore();
let panelOpt=ref(0);

watch(panelOpt, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
      localStorage.setItem("panelOpt", newValue)
    }
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
  .centered {
      padding-left:15%;
      padding-right:10%;
  }
  .market-list {
     font-size:1.2em;
     display: inline-block;
    text-align: left;
  }
</style>