<template>
    <v-container>
        <v-row>
            <v-col>
                <p class="mt-5">
                    <NuxtLink to="/dashboard">&lt;-- Back</NuxtLink>
                </p>
                <div v-if="isLoaded" class="mt-5">
                     <h2>Edit Product/Service</h2> 
                     <p class="mt-2"><em>{{productType}}</em></p>
                     <h3 class="mt-5">Targeted Location</h3>
                     <p class="mt-2"><em>{{targetedLocation}}</em></p>
                     <differentiators v-if="!isSubmitted" :showButtons="false" class="mt-10" />
                    <div class="mt-7">
                        <div 
                        id="g-recaptcha-edit"
                        class="g-recaptcha-edit"
                        :data-sitekey="sitekey"
                        />
                    </div>
                    <v-btn class="mt-7" @click="doEditReport" :disabled="isSubmitted">Submit Edits</v-btn>
                </div>
                <spinner v-else class="mt-5" :isLoading="!isLoaded" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    data() {
        return {
            isLoaded:false,
            productType: null,
            targetedLocation: null,
            isSubmitted:false,
            rawMaterialsEntry: null,
            laborCostsEntry: null,
            shippingCostsEntry: null,
            uniqueFeaturesEntry: null,
        }
    },
    computed: {
        sitekey() {
            return useRuntimeConfig().public.recaptchaSitekey
        }
    },
    methods: {
        async doEditReport() {
            try {
                this.isSubmitted=true;

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
              
                const token = window.grecaptcha.getResponse();
                if (token.length>0) {
                    const response = await fetch('/api/report/edit/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            reportId: this.$route.query.ReportID,
                            rawMaterialsEntry: this.rawMaterialsEntry,
                            laborCostsEntry: this.laborCostsEntry,
                            shippingCostsEntry: this.shippingCostsEntry,
                            uniqueFeaturesEntry: this.uniqueFeaturesEntry,
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
            window.grecaptcha.execute(this.widgetId, { action: 'edit'})
        },

        async fetchEntry(reportId) {
            await fetch("/api/report/get/",  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportId: reportId
                })
            })
            .then(response => response.json())
            .then(data => {
                

                if (data.success) {
                    let report = data.data;
                    this.productType = report.ProductType;
                    this.targetedLocation = report.TargetLocation;

                    localStorage.setItem("selectedDifferentiation","notunique");

                    if (report.uniqueFeaturesEntry!==null) {
                        localStorage.setItem("selectedDifferentiation","unique");
                        localStorage.setItem("uniqueFeatures","true");
                        localStorage.setItem("uniqueFeature","true");
                        localStorage.setItem("uniqueFeaturesEntry",report.uniqueFeaturesEntry);
                    }
                    if (report.laborCostsEntry!==null) {
                        localStorage.setItem("selectedDifferentiation","unique");
                        localStorage.setItem("productionCosts","true");
                        localStorage.setItem("laborCostsCheaper","true");
                        localStorage.setItem("laborCostsEntry",report.laborCostsEntry);
                    }
                    if (report.rawMaterialsEntry!==null) {
                        localStorage.setItem("selectedDifferentiation","unique");
                        localStorage.setItem("productionCosts","true");
                        localStorage.setItem("rawMaterialsCheaper","true");
                        localStorage.setItem("rawMaterialsEntry",report.rawMaterialsEntry);
                    }
                    if (report.shippingCostsEntry!==null) {
                        localStorage.setItem("selectedDifferentiation","unique");
                        localStorage.setItem("productionCosts","true");
                        localStorage.setItem("shippingCostsCheaper","true");
                        localStorage.setItem("shippingCostsEntry",report.shippingCostsEntry);
                    }

                    this.isLoaded=true;
                    setTimeout(this.render,1000);
                }
                else {
                    this.$state.store.errorText="Failed to get report";
                }
              
            })
            .catch(error => console.error('Error fetching reports:', error));
        },

        reset () {
            window.grecaptcha.reset(this.widgetId)
        },
        render () {
            if (window.grecaptcha) {
                this.widgetId = window.grecaptcha.render('g-recaptcha-edit', {
                sitekey: this.sitekey,
                })
            }
        }
    },
    mounted() {
      var state = localStorage.getItem('lgstate');
      localStorage.clear();
      localStorage.setItem('lgstate',state);

      this.fetchEntry(this.$route.query.ReportID);
    }
})
</script>
