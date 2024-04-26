 <template>

    <h3 class="mt-7 mb-3">How much money (in dollars) do you have (or you can reliably raise) to invest in this business?</h3>
    <p class="mt-5">Include enough for initial startup, marketing, plus <b>the first 6 months of expenses</b></p>
    <v-text-field class="field mt-5" v-model="money" :class="{'fielderror': money!==null&&(parseFloat(money)==NaN||money==0)}"  style="width:150px;"  density="compact" label="$" />

    <v-container class="mt-7 pa-0" fluid>
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
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'

let emit = defineEmits(['advancePanel','backPanel']);

let money=ref(null);

watch(money, async (newValue) => {
    localStorage.setItem("money", newValue)
});

function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
    if (money.value!==null&&parseFloat(money.value)!==NaN&&money.value>0&&money.value<1000000000000) {
        return false;
    }
    return true;
}

onMounted(()=>{

    let stored_money = localStorage.getItem("money");
    if (stored_money!==null) {
         money.value=stored_money;
    }
  
});
</script>