 <template>

    <h3 class="mt-7 mb-3">Where will your business serve customers?</h3>

    <v-radio-group v-model="locality">
        <v-radio value="national" label="All of the United States"></v-radio>
        <v-radio value="regional" @click="fillStateOptions" label="Specific State"></v-radio>
        <v-radio value="local" label="Specific City or Town"></v-radio>
    </v-radio-group>

    <v-select
        v-if="locality!==null&&locality!=='national'"
        v-model="state"
        :items="stateOptions"
        label="Which state?"
         @update:modelValue="fillCityOptions"
        outlined
        :disabled="stateOptions.length===0"
        class="mt-3 field field-select"
    ></v-select>

    <v-select
        v-if="locality!==null&&locality==='local'"
        v-model="city"
        :items="cityOptions"
        label="In which city/town (or the closest one in the list)?"
        outlined
        :disabled="state===null||cityOptions.length===0"
        class="mt-3 field field-select"
    ></v-select>
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
import csc  from 'countrycitystatejson';
import { ref, watch, onMounted } from 'vue'
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'

let city=ref(null);
let state=ref(null);
let locality=ref(null);
let stateOptions=ref([]);
let cityOptions=ref([]);

let emit = defineEmits(['advancePanel','backPanel']);

watch(locality, async (newValue) => {
    localStorage.setItem("locality", newValue)
});
watch(city, async (newValue) => {
    localStorage.setItem("city", newValue)
});
watch(state, async (newValue) => {
    localStorage.setItem("state", newValue)
});

function fillCityOptions() {
    city.value=null;
    if (state.value!==null) {
        cityOptions.value = csc.getCities("US",state.value);
    }
}

function fillStateOptions() {
    state.value=null;
    city.value=null;
    cityOptions.value=[];
    stateOptions.value = csc.getStatesByShort("US").filter(p=>p.length>2);
}

function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
    if (locality.value!==null) {
        if (locality.value==='national') {
            return false;
        }
        if (locality.value==='regional' && state.value===null) {
            return true;
        }
        if (locality.value==='local' && city.value===null) {
            return true;
        }
        return false;
    }
    return true;
}

onMounted(()=>{

    let stored_locality = localStorage.getItem("locality");
    if (stored_locality!==null) {
         locality.value=stored_locality;
    }
 
    if (locality.value!==null && locality.value!=='national') {
        fillStateOptions();
    }

    let stored_state = localStorage.getItem("state");
    if (stored_state!==null) {
         state.value=stored_state;
        fillCityOptions();
    }

    let stored_city = localStorage.getItem("city");
    if (stored_city!==null) {
         city.value=stored_city;
    }
  
});
</script>