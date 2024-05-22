<template>
    <div>
        <h2 class="mt-7">Summary</h2>
        <hr class="mt-3" />
        <v-container class="pa-0 mt-5" fluid>



            <v-row class="pa-0">
                <v-col cols="3" class="pb-0">
                    <b>Business:</b>
                </v-col>
                <v-col class="pb-0">
                    {{presentbusinesstype}}
                </v-col>
            </v-row>

            <v-row class="pa-0">
                <v-col cols="3" class="pb-0">
                    <b>
                        <span v-if="(businesstype!=='contractor'&&franchise==='false')||(businesstype==='contractor'&&platform==='false')">Product or Service</span>
                        <span v-if="(businesstype!=='contractor'&&franchise==='true')">
                            Franchising
                        </span>
                         <span v-if="(businesstype==='contractor'&&platform==='true')">
                            Using Platform
                        </span>:</b>
                </v-col>
                <v-col class="pb-0">
                    <span v-if="(businesstype!=='contractor'&&franchise==='false')||(businesstype==='contractor'&&platform==='false')">{{product}}</span>
                    <span v-if="(businesstype!=='contractor'&&franchise==='true')">
                        {{franchisee}}
                    </span>
                        <span v-if="(businesstype==='contractor'&&platform==='true')">
                        {{platformee}}
                    </span> 
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
                <v-col cols="3" class="pb-0 pt-2">
                    <b>Money to Invest:</b>
                </v-col>
                <v-col class="pb-0 pt-2">
                    ${{money}}
                </v-col>
            </v-row>

        </v-container>
        <div class="mt-15 mb-5">
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
    presentbusinesstype() {
        return this.businesstype=='brickandmortar'?"Brick and Mortar":(this.businesstype=='contractor'?"Independent Contractor":"Online");
    },
    sitekey() {
      return useRuntimeConfig().public.recaptchaSitekey
    }
  },
  data() {
    return {
        businesstype: null,
        money: null,
        franchise: 'false',
        platform: 'false',
        franchisee: null,
        platformee: null,
        targetedLocation: null,
        product: null,
        isSubmitted:false,
    }
  },
  mounted() {
        
    let stored_locality = localStorage.getItem("locality");
    if (stored_locality!==null) {
        if (stored_locality==="national") {
            this.targetedLocation="United States";
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
            this.targetedLocation+="United States";
        }
    }

    let stored_product = localStorage.getItem("product");
    if (stored_product!==null) {
        this.product=stored_product;
    }

    let stored_businesstype = localStorage.getItem("businesstype");
    if (stored_businesstype!==null) {
        this.businesstype=stored_businesstype;
    }

    let stored_platform = localStorage.getItem("platform");
    if (stored_platform!==null) {
        this.platform=stored_platform;
    }
    let stored_platformee = localStorage.getItem("platformee");
    if (stored_platformee!==null) {
        this.platformee=stored_platformee;
    }
    let stored_franchise = localStorage.getItem("franchise");
    if (stored_franchise!==null) {
        this.franchise=stored_franchise;
    }
    let stored_franchisee = localStorage.getItem("franchisee");
    if (stored_franchisee!==null) {
        this.franchisee=stored_franchisee;
    }

    let stored_money = localStorage.getItem("money");
    if (stored_money!==null) {
        this.money=stored_money;
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
                        money: this.money,
                        biztype: this.businesstype,
                        platformee: this.platformee,
                        franchisee: this.franchisee,
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