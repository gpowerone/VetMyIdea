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
            <v-row class="pa-0">
                <v-col cols="12" class="pb-0 pt-2">
                    <div>
                        <b>Differentiation:</b>
                    </div>
                        
                    <div class="mt-3" v-if="costsEntry!==null">
                        Cost strategy: {{costsEntry}} 
                    </div>   

                    <div class="mt-3" v-if="marketingEntry!==null">
                        Marketing strategy: {{marketingEntry}} 
                    </div>     

                     <div class="mt-3" v-if="uniqueFeaturesEntry!==null && uniqueFeaturesEntry.length>0">
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
                    <v-btn class="next-btn" @click="handleBack" :disabled="isSubmitted">
                         <v-icon :icon="mdiArrowLeft"></v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <div class="text-right mt-3" >
                        <v-btn @click="doCompleteReport" :disabled="isSubmitted">
                            Create Report!
                        </v-btn>
                        <div class="text-right">
                            <spinner class="mt-5" :isLoading="isSubmitted" />
                        </div>
                        <div ref="root" />
                           
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>    
</template>

<script setup>
import { mdiArrowLeft } from '@mdi/js'
import Spinner from '../components/spinner.vue';
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
        costsEntry: null,
        marketingEntry: null,
        uniqueFeaturesEntry: null,
        targetedLocation: null,
        product: null,
        isSubmitted:false,
    }
  },
  mounted() {
  
    let stored_costs_e  = localStorage.getItem("costsEntry");
    if (stored_costs_e!==null) {
        this.costsEntry=stored_costs_e;
    }

    let stored_marketing_e  = localStorage.getItem("marketingEntry");
    if (stored_marketing_e!==null) {
        this.marketingEntry=stored_marketing_e;
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
            this.isSubmitted=true;
            const token = window.grecaptcha.getResponse();
            if (token.length>0) {
                const response = await fetch('/api/report/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        costsEntry: this.costsEntry,
                        marketingEntry: this.marketingEntry,
                        uniqueFeaturesEntry: this.uniqueFeaturesEntry,
                        targetedLocation: this.targetedLocation,
                        product: this.product,
                        token: token
                    }),
                });

                this.isSubmitted=false;

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
           this.$store.state.errorText=error;
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