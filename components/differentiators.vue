<template>
       <v-container class="fluid pa-0">
             <v-row>
                <v-col cols="12">
                  
                    <h3 class="mt-7 mb-3">How much money (in dollars) do you have (or you can reliably raise) to invest in this business? (required)</h3>
                    <p class="mt-5">Include enough for initial startup, marketing, plus <b>the first 6 months of expenses</b></p>
                    <v-text-field class="field mt-5" v-model="money" :class="{'fielderror': money!==null&&(parseFloat(money)==NaN||money==0)}"  style="width:150px;"  density="compact" label="$" />

                    <div v-if="(businesstype!=='contractor'&&franchise==='false')||(businesstype==='contractor'&&platform==='false')">

                        <hr class="mt-10" />

                        <h3 class="mt-10 mb-5">Business Strategy Evaluation (optional)</h3> 
                 
                        <v-selection-control-group v-model="marketingCheck"> 
                            <v-checkbox label="I have a strategy to market my products"></v-checkbox>
                        </v-selection-control-group>   

                        <div v-if="marketingCheck===true">
                            <v-textarea bg-color="white"  class="mt-3 field" :class="{'fielderror': !marketingValid()}" v-model="marketingEntry" label="Briefly describe (<300 chars)" outlined dense></v-textarea>
                        </div>

                        <v-selection-control-group v-model="productionCosts"> 
                            <v-checkbox label="I have a strategy to price my products or services better than the competition"></v-checkbox>
                        </v-selection-control-group>   
                        
                        <div v-if="productionCosts===true">
                            <v-textarea  bg-color="white"  class="field" :class="{'fielderror': !costsValid()}" v-model="costsEntry" label="Briefly describe (<300 chars)" outlined dense></v-textarea>
                        </div>

                        <v-selection-control-group v-model="featureCheck"> 
                            <v-checkbox label="My product or service has a unique feature that stands out among the competition"></v-checkbox>
                        </v-selection-control-group>   

                        <div v-if="featureCheck===true">
                           <v-textarea class="mt-3 field" bg-color="white"  :class="{'fielderror': !uniqueFeatureValid()}" v-model="uniqueFeaturesEntry"  label="Briefly describe (<300 chars)" outlined dense></v-textarea>
                        </div>
          

                    </div> 
              
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
let marketingCheck = ref(false);
let featureCheck = ref(false);
let franchise = ref("false");
let platform = ref("false");
let businesstype = ref("");
let costsEntry = ref("");
let marketingEntry = ref("");
let uniqueFeaturesEntry = ref("");
let money=ref(null);

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

watch(marketingCheck, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("marketingCheck", newValue)
    }
});

watch(featureCheck, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("featureCheck", newValue)
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
watch(money, async (newValue) => {
    localStorage.setItem("money", newValue)
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

function moneyValid() {
    if (money.value!==null&&parseFloat(money.value)!==NaN&&money.value>0&&money.value<1000000000000) {
        return true;
    }
    return false;
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
    
   return !costsValid()||!marketingValid()||!uniqueFeatureValid()||!moneyValid();
   
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
  let stored_marketing_check = localStorage.getItem("marketingCheck");
  if (stored_marketing_check!==null) {
      marketingCheck.value=stored_marketing_check==="true";
  }
   let stored_feature_check = localStorage.getItem("featureCheck");
  if (stored_feature_check!==null) {
      featureCheck.value=stored_feature_check==="true";
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

    let stored_money = localStorage.getItem("money");
    if (stored_money!==null) {
         money.value=stored_money;
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