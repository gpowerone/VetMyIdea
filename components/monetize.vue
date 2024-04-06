<template>
 
     <v-select
        v-model="monetize"
        :items="monetizeOptions"
        label="How do you plan to monetize your idea?"
        class="mt-3 field-select"
    ></v-select>
    
    <div class="mt-5 text-center" v-if="monetize==='Accept donations'||monetize==='I do not plan to monetize my idea'">
        We cannot evaluate products or services being offered for free or with the intent to accept donations only. 
    </div>

    <div class="mt-5" v-if="monetize==='Start a business to sell a product or service'" >
        <v-container class="pa-0">
            <v-row>
                <v-col cols="12">
                    <v-text-field v-model="product" bg-color="white" class="field" :class="{'fielderror': !isProductTypeValid()}" label="Describe the product or service" outlined dense></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <differentiators ref="differ" class="mb-10" />
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
import differentiators from '../components/differentiators.vue'

let differ = ref();
let monetize=ref("");
let product=ref("");
let emit = defineEmits(['advancePanel']);
let monetizeOptions=ref(["Start a business to sell a product or service","Accept donations","I do not plan to monetize my idea"])

watch(monetize, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=50) {
        localStorage.setItem("monetize", newValue)
    }
});

watch(product, async (newValue, oldValue) => {
    if (newValue!==oldValue && newValue.length<=100) {
        localStorage.setItem("product", newValue)
    }
});

function handleAdvance() {
    emit('advancePanel');
}

function isProductTypeValid() {
    if (product.value.length===0 || (product.value.length<=100 && /^[A-Za-z0-9\'\.\s]+$/.test(product.value))) {
        return true;
    }
    return false;
    
}

function optionsHandled() {
    if (monetize.value!==null&&typeof(differ.value)!=="undefined") {
        if (product.value.length>0) {
             return !isProductTypeValid()&&!differ.value.optionsHandled();
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
