<template>
       <v-container class="fluid pa-0">
             <v-row>
                <v-col cols="12">
                  
                    <h3 class="mt-7 mb-3">How much money (in dollars) do you have (or you can reliably raise) to invest in this business? (required)</h3>
                    <p class="mt-5">Include enough for initial startup, marketing, plus <b>the first 6 months of expenses</b></p>
                    <v-text-field class="field mt-5" v-model="money" :class="{'fielderror': money!==null&&(parseFloat(money)==NaN||money==0)}"  style="width:150px;"  density="compact" label="$" />

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

let franchise = ref("false");
let platform = ref("false");
let businesstype = ref("");
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
watch(money, async (newValue) => {
    localStorage.setItem("money", newValue)
});


function moneyValid() {
    if (money.value!==null&&parseFloat(money.value)!==NaN&&money.value>0&&money.value<1000000000000) {
        return true;
    }
    return false;
}


function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
    
   return !moneyValid();
   
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