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
                        <v-selection-control-group  v-model="rawMaterialsCheaper" > 
                            <v-checkbox density="compact"  label="My raw materials cost less"></v-checkbox>                
                        </v-selection-control-group>
                        <v-text-field v-if="rawMaterialsCheaper===true" bg-color="white"  class="field" :class="{'fielderror': !rawMaterialsValid()}" v-model="rawMaterialsEntry" label="How?" outlined dense></v-text-field>

                        <v-selection-control-group  v-model="laborCostsCheaper" > 
                            <v-checkbox density="compact" label="My labor costs less"></v-checkbox>       
                        </v-selection-control-group>
                        <v-text-field v-if="laborCostsCheaper===true" bg-color="white"  class="field" :class="{'fielderror': !laborCostsValid()}" label="How?" v-model="laborCostsEntry" outlined dense></v-text-field>

                        <v-selection-control-group  v-model="shippingCostsCheaper" > 
                            <v-checkbox density="compact" label="My shipping costs less"></v-checkbox>          
                        </v-selection-control-group>
                        <v-text-field v-if="shippingCostsCheaper===true" bg-color="white"  class="field" :class="{'fielderror': !shippingCostsValid()}" label="How?" v-model="shippingCostsEntry" outlined dense></v-text-field>
                    </div>

                          
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div>
                        <b>Other Differentiators</b> 
                        <span class="tooltip tips" v-tooltip.bottom="{ content: `<p>There are some additional differentiators that could put your product or service above the competition. We do not evaluate these because it would be difficult to provide a fair evaluation without having source materials to analyze, or because these are more of a company strategy than a product-specific one:</p><p class='mt-5'>1. Marketing/Advertising Strategy<br />2. User Experience<br />3. Customer Service and Support</p>`}">?</span>
                     </div>       
                </v-col>
            </v-row>

        </v-container>           

</template>
<script setup>
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'
import { ref, watch } from 'vue'

let productionCosts = ref(false);
let rawMaterialsCheaper = ref(false);
let laborCostsCheaper = ref(false);
let shippingCostsCheaper = ref(false);
let rawMaterialsEntry = ref("");
let laborCostsEntry = ref("");
let shippingCostsEntry = ref("");
let uniqueFeaturesEntry = ref("");


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

function laborCostsValid() {
  if (laborCostsEntry.value.length>0 && (laborCostsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(laborCostsEntry.value))) {
        return false;
  }
  return true;
}

function rawMaterialsValid() {
  if (rawMaterialsEntry.value.length>0 && (rawMaterialsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(rawMaterialsEntry.value))) {
        return false;
  }
  return true;
}

function shippingCostsValid() {
  if (shippingCostsEntry.value.length>0 && (shippingCostsEntry.value.length>300 || !/^[A-Za-z0-9\.\'\s]+$/.test(shippingCostsEntry.value))) {
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
    
   return !laborCostsValid()||!rawMaterialsValid()||!shippingCostsValid()||!uniqueFeatureValid();
   
}

defineExpose({
    optionsHandled
})

onMounted(() => {

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
      shippingCostsEntry.value=stored_shipping_costs_e;
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