<template>
    <v-container>
        <v-row>
            <v-col>
                <div v-if="isLoaded">
                    <p class="mt-5">
                        <NuxtLink to="/dashboard">&lt;-- Back</NuxtLink>
                    </p>
                    <div class="mt-5">
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
                        <p class="mt-10"><b>Warning:</b> Re-running a report uses 1 of your 3 daily reports.<br />When viewing edited reports, you may need to hit the browser refresh button to see the updated changes!</p>
                    </div>
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
            isSubmitted:true,
            marketingEntry: null,
            costsEntry: null,
            uniqueFeaturesEntry: null
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

                let stored_marketing_e = localStorage.getItem("marketingEntry");
                if (stored_marketing_e!==null) {
                    this.marketingEntry=stored_marketing_e;
                }
                let stored_costs_e  = localStorage.getItem("costsEntry");
                if (stored_costs_e!==null) {
                    this.costsEntry=stored_costs_e;
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
                            marketingEntry: this.marketingEntry,
                            costsEntry: this.costsEntry,
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

                    if (report.uniqueFeaturesEntry!==null) {
                        localStorage.setItem("uniqueFeaturesEntry",report.uniqueFeaturesEntry);
                        localStorage.setItem("uncommonFeature", "true");
                    }
                    if (report.costEntry!==null) {
                        localStorage.setItem("productionCosts","true");
                        localStorage.setItem("costsEntry",report.costEntry);
                    }
                    if (report.marketingEntry!==null) {
                        localStorage.setItem("marketingStrategy","true");
                        localStorage.setItem("marketingEntry",report.marketingEntry);
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
                this.isSubmitted=false;
               
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
