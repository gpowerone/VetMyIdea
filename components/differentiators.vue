<template>
       <v-container class="fluid pa-0">
             <v-row>
                <v-col cols="12">
                    <h3 class="mt-5">Select ways your business is different from the competition</h3>
                    
                    <v-selection-control-group v-model="uncommonFeature"> 
                        <v-checkbox label="My product/service has a unique or uncommon feature that will attract customers"></v-checkbox>
                    </v-selection-control-group>   
                    
                    <div v-if="uncommonFeature===true">
                        <v-textarea class="field" bg-color="white"  :class="{'fielderror': !uniqueFeatureValid()}" v-model="uniqueFeaturesEntry" label="What feature will best draw in customers? (<300 chars)" outlined dense></v-textarea>
                    </div>


                    <v-selection-control-group v-model="productionCosts"> 
                        <v-checkbox label="My costs are less than my competitors"></v-checkbox>
                    </v-selection-control-group>   
                    
                    <div v-if="productionCosts===true">
                        <v-textarea  bg-color="white"  class="field" :class="{'fielderror': !costsValid()}" v-model="costsEntry" label="How? (<300 chars)" outlined dense></v-textarea>
                    </div>

                    <v-selection-control-group v-model="marketingStrategy"> 
                        <v-checkbox label="My marketing strategy is better than my competitors"></v-checkbox>
                    </v-selection-control-group>   
                    
                    <div v-if="marketingStrategy===true">
                        <v-textarea  bg-color="white"  class="field" :class="{'fielderror': !marketingValid()}" v-model="marketingEntry" label="How? (<300 chars)" outlined dense></v-textarea>
                    </div>
                          
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div>
                        <b>Other Differentiators</b> &nbsp;
                        <span class="tooltip" style="padding-top:1px;" v-tooltip.bottom="{ triggers: ['click'], content: `<p>There are some additional differentiators that could put your product or service above the competition. We do not evaluate these because it would be difficult to provide a fair evaluation without having source materials to analyze, or because these are more of a company strategy than a product-specific one:</p><p class='mt-5'>1. Advertising Strategy<br />2. User Experience<br />3. Customer Service and Support</p>`}">?</span>
                     </div>       
                </v-col>
            </v-row>

        </v-container>           

</template>
<script setup>
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'
import { ref, watch } from 'vue'

let uncommonFeature = ref(false);
let productionCosts = ref(false);
let marketingStrategy = ref(false);
let costsEntry = ref("");
let marketingEntry = ref("");
let uniqueFeaturesEntry = ref("");

watch(uncommonFeature, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("uncommonFeature", newValue)
    }
});
watch(productionCosts, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("productionCosts", newValue)
    }
});
watch(marketingStrategy, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("marketingStrategy", newValue)
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

function optionsHandled() {
    
   return !costsValid()||!marketingValid()||!uniqueFeatureValid();
   
}

defineExpose({
    optionsHandled
})

onMounted(() => {

  let stored_uncommon_feature = localStorage.getItem("uncommonFeature");
  if (stored_uncommon_feature!==null) {
      uncommonFeature.value=stored_uncommon_feature==="true";
  }
  let stored_prod_costs = localStorage.getItem("productionCosts");
  if (stored_prod_costs!==null) {
      productionCosts.value=stored_prod_costs==="true";
  }
  let marketing_strategy = localStorage.getItem("marketingStrategy");
  if (marketing_strategy!==null) {
      marketingStrategy.value=marketing_strategy==="true";
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