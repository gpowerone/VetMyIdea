<template>
       <v-container class="fluid pa-0">
              <v-row>
                <v-col cols="12">
                    <v-text-field class="field" bg-color="white"  :class="{'fielderror': !uniqueFeatureValid()}" v-model="uniqueFeaturesEntry" label="What unique feature will best draw in customers? (leave blank if nothing)" outlined dense></v-text-field>
                </v-col>
            </v-row>
             <v-row>
                <v-col cols="12">
                    <v-selection-control-group v-model="productionCosts"> 
                        <v-checkbox density="compact" label="My costs are less than my competitors"></v-checkbox>
                    </v-selection-control-group>   
                    
                    <div v-if="productionCosts===true">
                        <v-text-field  bg-color="white"  class="field" :class="{'fielderror': !costsValid()}" v-model="costsEntry" label="How?" outlined dense></v-text-field>
                    </div>

                    <v-selection-control-group v-model="marketingStrategy"> 
                        <v-checkbox density="compact" label="My marketing strategy is better than my competitors"></v-checkbox>
                    </v-selection-control-group>   
                    
                    <div v-if="marketingStrategy===true">
                        <v-text-field  bg-color="white"  class="field" :class="{'fielderror': !marketingValid()}" v-model="marketingEntry" label="How?" outlined dense></v-text-field>
                    </div>
                          
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div>
                        <b>Other Differentiators</b> 
                        <span class="tooltip tips" v-tooltip.bottom="{ content: `<p>There are some additional differentiators that could put your product or service above the competition. We do not evaluate these because it would be difficult to provide a fair evaluation without having source materials to analyze, or because these are more of a company strategy than a product-specific one:</p><p class='mt-5'>1. Advertising Strategy<br />2. User Experience<br />3. Customer Service and Support</p>`}">?</span>
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
let costsEntry = ref("");
let marketingEntry = ref("");
let uniqueFeaturesEntry = ref("");


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
  if (costsEntry.value.length>0 && (costsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(costsEntry.value))) {
        return false;
  }
  return true;
}

function marketingValid() {
  if (marketingEntry.value.length>0 && (marketingEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(marketingEntry.value))) {
        return false;
  }
  return true;
}

function uniqueFeatureValid() {
  if (uniqueFeaturesEntry.value.length>0 && (uniqueFeaturesEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(uniqueFeaturesEntry.value))) {
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