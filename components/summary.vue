<template>
    <div>
        <h2 class="mt-7">Report Summary</h2>
        <hr class="mt-3" />
        <v-container class="pa-0 mt-5" fluid>
            <v-row class="pa-0">
                <v-col cols="3" class="pb-0">
                    <b>Product or Service:</b>
                </v-col>
                <v-col class="pb-0">
                    {{product}}
                </v-col>
            </v-row>
            <v-row class="pa-0">
                <v-col cols="3" class="pb-0 pt-2">
                    <b>Targeted Location:</b>
                </v-col>
                <v-col class="pb-0 pt-2">
                    {{targetedLocation}}
                </v-col>
            </v-row>
            <v-row class="pa-0" v-if="selectedDifferentiation==='unique'">
                <v-col cols="12" class="pb-0 pt-2">
                    <div>
                        <b>Differentiation:</b>
                    </div>
                   
                    <div class="mt-3" v-if="rawMaterialsCheaper===true">
                        Raw materials cheaper because: {{rawMaterialsEntry}} 
                    </div>  

                    <div class="mt-3" v-if="laborCostsCheaper===true">
                        Labor costs cheaper because: {{laborCostsEntry}} 
                    </div>   

                    <div class="mt-3" v-if="shippingCostsCheaper===true">
                        Shipping costs cheaper because: {{shippingCostsEntry}} 
                    </div>     

                     <div class="mt-3" v-if="uniqueFeatures===true">
                        Feature with the greatest customer draw: {{uniqueFeaturesEntry}}
                     </div>
                </v-col>
            </v-row>
        </v-container>
        <div class="mt-3 mb-5">
            <hr />
        </div>
        <div>
            <div 
              id="g-recaptcha-veri"
              class="g-recaptcha-veri"
              :data-sitekey="sitekey"
            />
        </div>
        <v-container class="mt-5 pa-0" fluid>
            <v-row>
                <v-col cols="6">
                    <v-btn class="next-btn" @click="handleBack">
                         <v-icon :icon="mdiArrowLeft"></v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <div class="text-right mt-3" >
                        <v-btn @click="doCompleteReport">
                            Create Report!
                        </v-btn>
                            <div ref="root" />
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>    
</template>

<script setup>
import { mdiArrowLeft } from '@mdi/js'
</script>

<script>
export default {
  computed: {
    sitekey() {
      return useRuntimeConfig().public.recaptchaSitekey
    }
  },
  data() {
    return {
        selectedDifferentiation: "",
        rawMaterialsCheaper: false,
        laborCostsCheaper: false,
        shippingCostsCheaper: false,
        uniqueFeatures: false,
        missingFeatures: false,
        userExperience: false,
        rawMaterialsEntry: null,
        laborCostsEntry: null,
        shippingCostsEntry: null,
        uniqueFeaturesEntry: null,
        targetedLocation: null,
        product: null,
    }
  },
  mounted() {
    let stored_diff = localStorage.getItem("selectedDifferentiation");
    if (stored_diff!==null) {
        this.selectedDifferentiation=stored_diff;
    }
    let stored_raw_materials = localStorage.getItem("rawMaterialsCheaper");
    if (stored_raw_materials!==null) {
        this.rawMaterialsCheaper=stored_raw_materials==="true";
    }
    let stored_labor_costs = localStorage.getItem("laborCostsCheaper");
    if (stored_labor_costs!==null) {
        this.laborCostsCheaper=stored_labor_costs==="true";
    }
    let stored_shipping_costs = localStorage.getItem("shippingCostsCheaper");
    if (stored_shipping_costs!==null) {
        this.shippingCostsCheaper=stored_labor_costs==="true";
    }
    let stored_unique_features = localStorage.getItem("uniqueFeatures");
    if (stored_unique_features!==null) {
        this.uniqueFeatures=stored_unique_features==="true";
    }
    let stored_missing_features = localStorage.getItem("missingFeatures");
    if (stored_missing_features!==null) {
        this.missingFeatures=stored_missing_features==="true";
    }
    let stored_user_experience = localStorage.getItem("userExperience");
    if (stored_user_experience!==null) {
        this.userExperience=stored_user_experience==="true";
    }
    let stored_raw_materials_e = localStorage.getItem("rawMaterialsEntry");
    if (stored_raw_materials_e!==null) {
        this.rawMaterialsEntry=stored_raw_materials_e;
    }
    let stored_labor_costs_e  = localStorage.getItem("laborCostsEntry");
    if (stored_labor_costs_e!==null) {
        this.laborCostsEntry=stored_labor_costs_e;
    }
    let stored_shipping_costs_e  = localStorage.getItem("shippingCostsEntry");
    if (stored_shipping_costs_e!==null) {
        this.shippingCostsEntry=stored_shipping_costs_e;
    }
    let stored_unique_features_e  = localStorage.getItem("uniqueFeaturesEntry");
    if (stored_unique_features_e!==null) {
        this.uniqueFeaturesEntry=stored_unique_features_e;
    }
        
    let stored_locality = localStorage.getItem("locality");
    if (stored_locality!==null) {
        if (stored_locality==="International") {
            this.targetedLocation="All Locations";
        }    
        else {
            
            this.targetedLocation=""; 
            let stored_city = localStorage.getItem("city");
            if (stored_city!==null) {
                this.targetedLocation+=stored_city+", "
            }
            let stored_state = localStorage.getItem("state");
            if (stored_state!==null) {
                this.targetedLocation+=stored_state+", "
            }
            let stored_country = localStorage.getItem("country");
            if (stored_country!==null) {
                this.targetedLocation+=stored_country;
            }
        }
    }

    let stored_product = localStorage.getItem("product");
    if (stored_product!==null) {
        this.product=stored_product;
    }
    
    this.render()
  },
  methods: {
    async doCompleteReport() {
        try {
            const token = window.grecaptcha.getResponse();
            if (token.length>0) {
                const response = await fetch('/api/report/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rawMaterialsEntry: this.rawMaterialsEntry,
                        laborCostsEntry: this.laborCostsEntry,
                        shippingCostsEntry: this.shippingCostsEntry,
                        uniqueFeaturesEntry: this.uniqueFeaturesEntry,
                        targetedLocation: this.targetedLocation,
                        product: this.product,
                        token: token
                    }),
                });

                if (!response.ok) {
                    this.$store.state.errorText="Failed to contact the backend, check your internet connection"
                }
                else {

                    const responseData = await response.json();
                    if (responseData.success) {
                        var state = localStorage.getItem('lgstate');
                        localStorage.clear();
                        localStorage.setItem('lgstate',state);
                        navigateTo("/dashboard");
                    }
                    else {
                        if (responseData.message) {
                            this.$store.state.errorText=responseData.message;
                            if (this.$store.state.errorText=="Invalid Session") {
                                localStorage.removeItem("lgstate");
                                this.$store.state.isLoggedIn=false;
                                this.$store.state.name=null;
                            }
                        }
                        else {
                            this.$store.state.errorText="An unspecified error occurred";
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    execute () {
      window.grecaptcha.execute(this.widgetId, { action: 'veri'})
    },
    handleBack() {
        this.$emit('backPanel');
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha-veri', {
          sitekey: this.sitekey,
        })
      }
    },
  }
}
</script>