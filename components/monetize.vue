<template>
 
    <v-container class="pa-0 mt-5">
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="product" bg-color="white" class="field" :class="{'fielderror': !isProductTypeValid()}" label="Describe the product or service (<100 chars)" outlined dense></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <differentiators ref="differ" class="mb-5" />
            </v-col>
        </v-row>
    </v-container>

    <div class="mt-3 text-right">
        <v-btn @click="handleAdvance" class="next-btn" :disabled="optionsHandled()">
                <v-icon :icon="mdiArrowRight"></v-icon>
        </v-btn>
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
    if (product.value.length===0 || product.value.length<=100) {
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
