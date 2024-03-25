<template>
       <v-form>

            <h2 class="mt-7">Differentiation</h2>
            <p class="mt-5"><b>Choose one</b>:</p>

            <v-radio-group v-model="selectedDifferentiation">
                <v-radio class="mt-5" label="My product or service offers better value than competitors or has unique features" :value="'unique'"></v-radio> 
                <v-card class="popout" v-if="selectedDifferentiation === 'unique'">
                    
                    <v-selection-control-group v-model="productionCosts"> 
                        <v-checkbox density="compact" label="My costs are less than my competitors"></v-checkbox>
                    </v-selection-control-group>      
                    
                    <div v-if="productionCosts===true" class="popout">
                        <v-selection-control-group  v-model="rawMaterialsCheaper" > 
                            <v-checkbox density="compact" label="My raw materials cost less"></v-checkbox>                
                        </v-selection-control-group>
                        <v-text-field v-if="rawMaterialsCheaper===true" class="field" v-model="rawMaterialsEntry" label="What raw materials? (300 characters or less, alphanumeric characters and periods only)" outlined dense></v-text-field>

                        <v-selection-control-group  v-model="laborCostsCheaper" > 
                            <v-checkbox density="compact" label="My labor costs less"></v-checkbox>       
                        </v-selection-control-group>
                        <v-text-field v-if="laborCostsCheaper===true" class="field" label="Describe (300 characters or less, alphanumeric characters and periods only)" v-model="laborCostsEntry" outlined dense></v-text-field>

                        <v-selection-control-group  v-model="shippingCostsCheaper" > 
                            <v-checkbox density="compact" label="My shipping costs less"></v-checkbox>          
                        </v-selection-control-group>
                        <v-text-field v-if="shippingCostsCheaper===true" class="field" label="How? (300 characters or less, alphanumeric characters and periods only)" v-model="shippingCostsEntry" outlined dense></v-text-field>
                    </div>
                   

                     <v-selection-control-group class="mt-5" v-model="uniqueFeatures" > 
                        <v-checkbox density="compact" label="My product or service has feature(s) customers want but competitors don't have (or do poorly)"></v-checkbox>          
                     </v-selection-control-group>
                     <v-text-field v-if="uniqueFeatures===true" class="field" v-model="uniqueFeaturesEntry" label="What feature will have the greatest customer draw?" outlined dense></v-text-field>

                     <div class="mt-5 mb-2">
                        <b>Other Differentiators</b> 
                        <span class="tooltip tips" v-tooltip.bottom="{ content: `<p>There are some additional differentiators that could put your product or service above the competition. We do not evaluate these because it would be difficult to provide a fair evaluation without having source materials to analyze, or because these are more of a company strategy than a product-specific one:</p><p class='mt-5'>1. Marketing/Advertising Strategy<br />2. User Experience<br />3. Customer Service and Support</p>`}">?</span>
                     </div>
                    

                
                </v-card>             
                <v-radio class="mt-5" label="My product or service is equivalent to what competitors offer" :value="'notunique'"></v-radio>
                <v-card class="popout" v-if="selectedDifferentiation === 'notunique'">
                    It doesn't need to be different to be a good idea!
                </v-card>
                <v-radio class="mt-5" label="My product or service is novel and there is no competition" :value="'novel'"></v-radio>
                <v-card class="popout" v-if="selectedDifferentiation === 'novel'">
                    If the product or service is truly novel (meaning the world has never seen it), then we cannot evaluate your idea as we have no data to base our report on. You can still run this report 
                    and we will search to see if we can find an existing market or potential competitors for your idea. 
                </v-card>
            </v-radio-group>
           
            <v-container class="mt-5 pa-0" fluid>
                <v-row>
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
        </v-form>           

</template>
<script setup>
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'
import { ref, watch } from 'vue'

let selectedDifferentiation = ref("");
let productionCosts = ref(false);
let rawMaterialsCheaper = ref(false);
let laborCostsCheaper = ref(false);
let shippingCostsCheaper = ref(false);
let uniqueFeatures = ref(false);
let rawMaterialsEntry = ref("");
let laborCostsEntry = ref("");
let shippingCostsEntry = ref("");
let uniqueFeaturesEntry = ref("");

let emit = defineEmits(['advancePanel','backPanel']);

watch(selectedDifferentiation, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<20) {
        localStorage.setItem("selectedDifferentiation", newValue)
    }
});
watch(productionCosts, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("productionCosts", newValue)
    }
});
watch(rawMaterialsCheaper, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("rawMaterialsCheaper", newValue)
    }
});
watch(laborCostsCheaper, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("laborCostsCheaper", newValue)
    }
});
watch(shippingCostsCheaper, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("shippingCostsCheaper", newValue)
    }
});
watch(uniqueFeatures, async (newValue, oldValue) => {
    if (newValue!==oldValue) {
        localStorage.setItem("uniqueFeatures", newValue)
    }
});
watch(rawMaterialsEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("rawMaterialsEntry", newValue)
    }
});
watch(laborCostsEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("laborCostsEntry", newValue)
    }
});
watch(shippingCostsEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("shippingCostsEntry", newValue)
    }
});
watch(uniqueFeaturesEntry, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=300) {
        localStorage.setItem("uniqueFeaturesEntry", newValue)
    }
});

function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
     if (laborCostsEntry.value.length>0 && (laborCostsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(laborCostsEntry.value))) {
        return true;
    }
    if (rawMaterialsEntry.value.length>0 && (rawMaterialsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(rawMaterialsEntry.value))) {
        return true;
    }
     if (shippingCostsEntry.value.length>0 && (shippingCostsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(shippingCostsEntry.value))) {
        return true;
    }
    if (selectedDifferentiation.value!=="") {
        return false;
    }
    return true;
}

onMounted(() => {
  let stored_diff = localStorage.getItem("selectedDifferentiation");
  if (stored_diff!==null) {
      selectedDifferentiation.value=stored_diff;
  }
  let stored_prod_costs = localStorage.getItem("productionCosts");
  if (stored_prod_costs!==null) {
      productionCosts.value=stored_prod_costs==="true";
  }
  let stored_raw_materials = localStorage.getItem("rawMaterialsCheaper");
  if (stored_raw_materials!==null) {
      rawMaterialsCheaper.value=stored_raw_materials==="true";
  }
  let stored_labor_costs = localStorage.getItem("laborCostsCheaper");
  if (stored_labor_costs!==null) {
      laborCostsCheaper.value=stored_labor_costs==="true";
  }
  let stored_shipping_costs = localStorage.getItem("shippingCostsCheaper");
  if (stored_shipping_costs!==null) {
      shippingCostsCheaper.value=stored_labor_costs==="true";
  }
  let stored_unique_features = localStorage.getItem("uniqueFeatures");
  if (stored_unique_features!==null) {
      uniqueFeatures.value=stored_unique_features==="true";
  }
  let stored_raw_materials_e = localStorage.getItem("rawMaterialsEntry");
  if (stored_raw_materials_e!==null) {
      rawMaterialsEntry.value=stored_raw_materials_e;
  }
  let stored_labor_costs_e  = localStorage.getItem("laborCostsEntry");
  if (stored_labor_costs_e!==null) {
      laborCostsEntry.value=stored_labor_costs_e;
  }
  let stored_shipping_costs_e  = localStorage.getItem("shippingCostsEntry");
  if (stored_shipping_costs_e!==null) {
      shippingCostsEntry.value=stored_labor_costs_e;
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

<style scoped>
    .popout {
        margin-left:25px;
        padding:10px;
        background: #EEE;
        border:1px solid #0c1d36;
        border-radius:10px;
        margin-bottom:15px;
    }
</style>