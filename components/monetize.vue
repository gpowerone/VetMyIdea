<template>
 
     <v-select
        v-model="monetize"
        :items="monetizeOptions"
        label="How do you plan to monetize your idea?"
        class="mt-3 field field-select"
    ></v-select>
    
    <div class="mt-5 text-center" v-if="monetize==='Accept donations'||monetize==='I do not plan to monetize my idea'">
        We cannot evaluate products or services being offered for free or with the intent to accept donations only. 
    </div>

    <div class="mt-5" v-if="monetize==='Start a business to sell a product or service'" >
        <v-container class="pa-0">
            <v-row>
                <v-col cols="10" xs="10" sm="11" md="11" lg="11" xl="11" xxl="11">
                    <v-text-field v-model="product" class="field" label="Describe the product or service (up to 100 chars)"></v-text-field>
                </v-col>
                <v-col cols="2" xs="2" sm="1" md="1" lg="1" xl="1" xxl="1">
                    <span class="tooltip tips d-block" v-tooltip.bottom="{ content: `<h3>Tips</h3><p>1. Give us only the product or service (e.g. 'golf club' or 'email marketing')<br /><br />2. If multiple types of businesses could sell the product or service then be specific (e.g. if you're selling 'food', then specify that you want to sell 'grocery store food', 'diner food', or 'steakhouse food', etc.)<br /><br />3.  Don't add the features that make your product or service unique here (we'll get to that later).</p>`}">?</span>
                </v-col>
            </v-row>
        </v-container>

        <div class="mt-3">
            <v-btn @click="handleAdvance" class="next-btn" :disabled="optionsHandled()">
                 <v-icon :icon="mdiArrowRight"></v-icon>
            </v-btn>
        </div>
    </div>
     
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { mdiArrowRight } from '@mdi/js'

let monetize=ref(null);
let product=ref(null);
let emit = defineEmits(['advancePanel']);
let monetizeOptions=ref(["Start a business to sell a product or service","Accept donations","I do not plan to monetize my idea"])

watch(monetize, async (newValue) => {
    localStorage.setItem("monetize", newValue)
    
});

watch(product, async (newValue) => {
    localStorage.setItem("product", newValue)
});

function handleAdvance() {
    emit('advancePanel');
}

function optionsHandled() {
    if (monetize.value!==null) {
        if (product.value!==null) {
          if (product.value.length>0 && product.value.length<=100 && /^[A-Za-z0-9\'\.\s]+$/.test(product.value)) {
              return false;
          }
        }  
    } 
    return true;
}

onMounted(() => {
  let stored_monetize = localStorage.getItem("monetize");
  if (stored_monetize!==null) {
      monetize.value=stored_monetize;
  }
  let stored_product = localStorage.getItem("product");
  if (stored_product!==null) {
      product.value=stored_product;
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
