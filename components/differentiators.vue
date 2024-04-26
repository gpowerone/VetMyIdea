<template>
       <v-container class="fluid pa-0">
             <v-row>
                <v-col cols="12">
                  
                    <div v-if="(businesstype!=='contractor'&&franchise==='false')||(businesstype==='contractor'&&platform==='false')">
                        <h3 class="mt-5">Marketing Strategy</h3>
                        <p class="mt-3">How do you plan to market this business?</p>
                        <v-textarea bg-color="white"  class="mt-3 field" :class="{'fielderror': !marketingValid()}" v-model="marketingEntry" label="Briefly describe your marketing strategy (<300 chars)" outlined dense></v-textarea>

                        <hr class="mt-5" />
                        
                        <h3 class="mt-5">Cost Strategy</h3>

                        <v-selection-control-group v-model="productionCosts"> 
                            <v-checkbox label="I have a strategy to price my products or services better than the competition"></v-checkbox>
                        </v-selection-control-group>   
                        
                        <div v-if="productionCosts===true">
                            <v-textarea  bg-color="white"  class="field" :class="{'fielderror': !costsValid()}" v-model="costsEntry" label="How? (<300 chars)" outlined dense></v-textarea>
                        </div>

                        <hr />

                    </div>
                  
                    <h3 class="mt-5">How will your business, product, or service best stand out among the competition?</h3>
                    <v-textarea class="mt-3 field" bg-color="white"  :class="{'fielderror': !uniqueFeatureValid()}" v-model="uniqueFeaturesEntry"  label="How? (<300 chars)" outlined dense></v-textarea>
                          
                </v-col>
            </v-row>
          
        
            <v-row v-if="props.showButtons">
                <v-col cols="6">
                    <v-btn class="next-btn" @click="handleBack">
                        <v-icon :icon="mdiArrowLeft"></v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <div class="text-right" >
                        <v-btn class="next-btn"  @click="handleAdvance" :disabled="optionsHandled()">
                            <v-icon :icon="mdiArrowRight"></v-icon>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        
        </v-container>          

</template>
<script setup>
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'
import { ref, watch } from 'vue'

let productionCosts = ref(false);
let marketingStrategy = ref(false);
let franchise = ref("false");
let platform = ref("false");
let businesstype = ref("");
let costsEntry = ref("");
let marketingEntry = ref("");
let uniqueFeaturesEntry = ref("");

let emit = defineEmits(['advancePanel','backPanel']);
const props = defineProps(['showButtons'])

watch(businesstype, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("businesstype", newValue)
    }
});

watch(franchise, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("franchise", newValue)
    }
});

watch(platform, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("platform", newValue)
    }
});

watch(productionCosts, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("productionCosts", newValue)
    }
});
watch(costsEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("costsEntry", newValue)
    }
});
watch(marketingEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("marketingEntry", newValue)
    }
});
watch(uniqueFeaturesEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("uniqueFeaturesEntry", newValue)
    }
});

function costsValid() {
  let costs = costsEntry.value.trim();
  if (costs.length>0 && costs.length>300) {
        return false;
  }
  return true;
}

function marketingValid() {
  let marketing = marketingEntry.value.trim();
  if (marketing.length>0 && marketing.length>300) {
        return false;
  }
  return true;
}

function uniqueFeatureValid() {
  let uniquefeature = uniqueFeaturesEntry.value.trim();
  if (uniquefeature.length>0 && uniquefeature.length>300) {
        return false;
  }
  return true;
}

function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
    
   return !costsValid()||!marketingValid()||!uniqueFeatureValid();
   
}

onMounted(() => {

  let stored_platform = localStorage.getItem("platform");
  if (stored_platform!==null) {
      platform.value=stored_platform;
  }
  let stored_franchise = localStorage.getItem("franchise");
  if (stored_franchise!==null) {
      franchise.value=stored_franchise;
  }
  let stored_prod_costs = localStorage.getItem("productionCosts");
  if (stored_prod_costs!==null) {
      productionCosts.value=stored_prod_costs==="true";
  }
  let stored_costs_e = localStorage.getItem("costsEntry");
  if (stored_costs_e!==null) {
      costsEntry.value=stored_costs_e;
  }
  let stored_marketing_e  = localStorage.getItem("marketingEntry");
  if (stored_marketing_e!==null) {
      marketingEntry.value=stored_marketing_e;
  }
  let stored_unique_features_e  = localStorage.getItem("uniqueFeaturesEntry");
  if (stored_unique_features_e!==null) {
      uniqueFeaturesEntry.value=stored_unique_features_e;
  }
   let stored_businesstype = localStorage.getItem("businesstype");
  if (stored_businesstype!==null) {
      businesstype.value=stored_businesstype;
  }
})

</script>

<style>
    .v-input__details {
        display:none;
    }
    .v-label {
        opacity: 1 !important;
    }
</style>