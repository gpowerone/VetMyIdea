 <template>

    <h2 class="mt-7">Location</h2>
    <v-select
        v-model="locality"
        :items="localityOptions"
        label="Where will you target your business?"
        outlined
        class="mt-7 field field-select"
    ></v-select>

    <v-select
        v-if="locality!==null&&locality!=='International'"
        v-model="country"
        :items="countryOptions"
        label="Which country?"
        @update:modelValue="fillStateOptions"
        outlined
        class="mt-3 field field-select"
    ></v-select>

    <v-select
        v-if="locality!==null&&locality!=='International'&&locality!=='National'"
        v-model="state"
        :items="stateOptions"
        label="Which region/state/province?"
         @update:modelValue="fillCityOptions"
        outlined
        :disabled="country===null||stateOptions.length===0"
        class="mt-3 field field-select"
    ></v-select>

        <v-select
        v-if="locality!==null&&locality!=='International'&&locality!=='National'&&locality!=='Regional'"
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

let locality=ref(null);
let country=ref(null);
let city=ref(null);
let state=ref(null);
let countryOptions=ref([]);
let stateOptions=ref([]);
let cityOptions=ref([]);
let localityOptions = ref(['International','National','Regional','Local']);

let emit = defineEmits(['advancePanel','backPanel']);

watch(locality, async (newValue) => {
    localStorage.setItem("locality", newValue)
});
watch(country, async (newValue) => {
    localStorage.setItem("country", newValue)
});
watch(city, async (newValue) => {
    localStorage.setItem("city", newValue)
});
watch(state, async (newValue) => {
    localStorage.setItem("state", newValue)
});

function fillCityOptions() {
    city.value=null;
    if (country.value!==null && state.value!==null) {
        let ccode = csc.getCountries().filter(p=>p.name===country.value)[0].shortName;
        cityOptions.value = csc.getCities(ccode,state.value);
    }
}

function fillStateOptions() {
    state.value=null;
    city.value=null;
    cityOptions.value=[];
    if (country.value!==null) {
        let code = csc.getCountries().filter(p=>p.name===country.value)[0].shortName;
        stateOptions.value = csc.getStatesByShort(code).filter(p=>p.length>2);
    }
}

function handleAdvance() {
    emit('advancePanel');
}

function handleBack() {
    emit('backPanel');
}

function optionsHandled() {
    if (locality.value!==null) {
        if (locality.value==='National' && country.value===null) {
            return true;
        }
        if (locality.value==='Regional' && state.value===null) {
            return true;
        }
        if (locality.value==='Local' && city.value===null) {
            return true;
        }
        return false;
    }
    return true;
}

onMounted(()=>{
    countryOptions.value=csc.getCountries().map(p=>p.name).sort();

    let stored_locality = localStorage.getItem("locality");
    if (stored_locality!==null) {
         locality.value=stored_locality;
    }
    let stored_country = localStorage.getItem("country");
    if (stored_country!==null) {
         country.value=stored_country;
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