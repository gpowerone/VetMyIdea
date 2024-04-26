<template>
 
    <v-container class="pa-0 mt-5">
        <v-row>
            <v-col cols="12">
                <h3 class="mb-3">Which best describes the business you want to start?</h3>
                <v-radio-group v-model="businesstype">
                    <v-radio value="brickandmortar" label="Brick and Mortar Store"></v-radio>
                    <v-radio value="online" label="Online Only"></v-radio>
                    <v-radio value="contractor" label="Independent Contractor/Owner"></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>
        
        <v-row v-if="businesstype!==null&&businesstype!=='contractor'">
            <v-col cols="12">

                <h3 class="mb-3 mt-5">Will this business be a franchise?</h3>
                <v-radio-group v-model="franchise">
                    <v-radio value="false" label="No"></v-radio>
                    <v-radio value="true" label="Yes"></v-radio>
                </v-radio-group>
            
                <v-text-field v-if="franchise==='true'" v-model="franchisee" bg-color="white" class="mt-5 field" label="Type the name of the business you will franchise (e.g. McDonalds)" outlined dense></v-text-field>
            </v-col>
        </v-row>

        <v-row v-if="businesstype!==null&&businesstype==='contractor'">
            <v-col cols="12">

                <h3 class="mb-3 mt-5">Will you be contracting via an existing platform (e.g. Uber, Grubhub, etc...)?</h3>
                <v-radio-group v-model="platform">
                    <v-radio value="false" label="No"></v-radio>
                    <v-radio value="true" label="Yes"></v-radio>
                </v-radio-group>

                 <v-text-field v-if="platform==='true'" v-model="platformeee" bg-color="white" class="mt-5 field" label="Type the name of the platform (e.g. Uber)" outlined dense></v-text-field>
            </v-col>
        </v-row>

        <v-row v-if="businesstype!==null&&((businesstype!=='contractor'&&franchise==='false')||(businesstype==='contractor'&&platform==='false'))">
            <v-col cols="12">
                <v-textarea v-model="product" bg-color="white" class="mt-5 field" :class="{'fielderror': product!==null&&product.length>0&&!isValueValid(product)}" label="Briefly describe the products or services your business will provide" outlined dense></v-textarea>
            </v-col>
        </v-row>
        
    </v-container>

    <div class="mt-5 text-right">
        <v-btn @click="handleAdvance" class="next-btn" :disabled="optionsHandled()">
                <v-icon :icon="mdiArrowRight"></v-icon>
        </v-btn>
    </div>

     
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { mdiArrowRight } from '@mdi/js'

let product=ref(null);
let businesstype=ref(null);
let franchise=ref("false");
let platform=ref("false");
let franchisee=ref("");
let platformee=ref("");
let emit = defineEmits(['advancePanel']);

watch(product, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("product", newValue)
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

watch(franchisee, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("franchisee", newValue)
    }
});

watch(platformee, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("platformee", newValue)
    }
});

watch(businesstype, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("businesstype", newValue)
    }
});

function handleAdvance() {
    emit('advancePanel');
}

function isValueValid(val) {
    if (val!==null && val.length>0 && val.length<=100) {
        return true;
    }
    return false;
    
}

function optionsHandled() {

    if (businesstype.value==='online'||businesstype.value==='brickandmortar') {
        if (franchise.value==='false'&&isValueValid(product.value)) {
            return false;
        }
        if (franchise.value==='true'&&isValueValid(franchisee.value)) {
            return false;
        }
    
    }
    else if (businesstype.value==='contractor')
    {
        if (platform.value==='false'&&isValueValid(product.value)) {
            return false;
        }
        if (platform.value==='true'&&isValueValid(platformee.value)) {
            return false;
        }
    }
   

    return true;
}

onMounted(() => {
  let stored_product = localStorage.getItem("product");
  if (stored_product!==null) {
      product.value=stored_product;
  }
  let stored_platform = localStorage.getItem("platform");
  if (stored_platform!==null) {
      platform.value=stored_platform;
  }
  let stored_platformee = localStorage.getItem("platformee");
  if (stored_platformee!==null) {
      platformee.value=stored_platformee;
  }
  let stored_franchise = localStorage.getItem("franchise");
  if (stored_franchise!==null) {
      franchise.value=stored_franchise;
  }
  let stored_franchisee = localStorage.getItem("franchisee");
  if (stored_franchisee!==null) {
      franchisee.value=stored_franchisee;
  }
  let stored_businesstype = localStorage.getItem("businesstype");
  if (stored_businesstype!==null) {
      businesstype.value=stored_businesstype;
  }

})
</script>

<style scoped>
.tips {
    font-size:1.8em;
    width:50px!important;
    height:50px!important;
    margin-left:-10px!important;
}
</style>
