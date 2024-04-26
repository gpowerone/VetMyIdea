<template>
    <v-container class="wizard"  fluid>
      <v-row>
         <v-col cols="12" lg="3" xs="12" class="d-none d-sm-flex">&nbsp;</v-col>
         <v-col cols="12" lg="6" xs="12" >


            <div class="panel mt-5" :class="{'centered':$vuetify.display.md||$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl,'mt-10':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}" v-if="panelOpt==0">
               <biztype v-on:advancePanel="advancePanel" />
            </div>
            <div class="panel" v-if="panelOpt==1"  >
               <locality v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" />
            </div>
            <div class="panel" v-if="panelOpt==2"  >
                <finance v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" />
            </div>
            <div class="panel" v-if="panelOpt==3"  >
                <differentiators v-on:advancePanel="advancePanel" v-on:backPanel="backPanel" :showButtons="true" />
            </div>

            <div class="panel" v-if="panelOpt==4" >
               <div v-if="store.state.isLoggedIn===true">
                  <summarycomp v-on:backPanel="backPanel" />
               </div>
               <div v-else>
                  <login v-on:backPanel="backPanel" :loadBack="true"  />
               </div>
            </div>

        </v-col>
         <v-col cols="12" lg="3" xs="12" v-if="panelOpt==0" class="d-none d-sm-flex">&nbsp;</v-col>
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
import biztype from '../components/biztype.vue'
import locality from '../components/locality.vue'
import finance from '../components/finance.vue'
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