<template>
  <v-container class="pa-0" :class="{'mt-10':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}" >
    <v-row>
      <v-col cols="12" lg="5">
        <h2 class="mb-5 mt-10 text-center">Login</h2>
        <v-card class="loginCard">
          <v-card-text>
        
            <!-- Google Login -->
            <div id="g_id_signin"></div>
            <v-divider class="mt-5 mb-5" ></v-divider>
            <v-btn @click="login" class="login-btn">Login with Username/Password</v-btn>
         
      
          </v-card-text>
        </v-card>
        <p class="loginCard mt-7 text-center">By creating an account or logging in, you agree to our <NuxtLink to="/privacy">Privacy Policy</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink></p>
      </v-col>
      <v-col cols="12" lg="2" class="d-md-none d-lg-block">
         &nbsp;
      </v-col>
      <v-col cols="12" lg="5">
        <div :class="{'mt-15':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}">
          <h3>Create An Account</h3>
          <p class="mt-5">
          &bull; Get Your Free Report<br />
          &bull; Create Additional Free Reports (up to 3/day)<br />
          &bull; Optionally Share Your Reports<br />
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="loadBack">
        <v-col cols="12">
            <v-btn @click="handleBack" class="next-btn">
               <v-icon :icon="mdiArrowLeft" />
            </v-btn>
        </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { mdiArrowLeft } from '@mdi/js'
</script>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
    };
  },
  props: {
    loadBack: Boolean,
  },
  computed: {
    googleclientid() {
      return useRuntimeConfig().public.googleClient
    },
    oauthclientid() {
      return useRuntimeConfig().public.oauthClient
    },
    oauthscopes() {
      return useRuntimeConfig().public.oauthScopes
    },
    oauthuri() {
      return useRuntimeConfig().public.oauthUri
    },
    oauthredirecturi() {
      return useRuntimeConfig().public.oauthRedirect
    }
  },
  mounted() {

    if (this.isStateValid(this.$route.query.state)) {
        localStorage.removeItem('pestate');

        if (this.$route.query.error_description && this.$route.query.error_description=="Please verify your email before continuing.") {
            this.$store.state.successText = "Please verify your email address and then log in again";
        } 
        else {
          fetch("/api/login/oauth/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: this.$route.query.code, typ:this.loadBack?"w":"d" }),
          })
          .then(async (response)=>await response.json())
          .then(async (response)=>{
              if (response.success) {
                  let lgstate = {
                      name: response.data,
                      isLoggedIn: true,
                      id: response.id
                  };
                  localStorage.setItem("lgstate", JSON.stringify(lgstate));
                  this.$store.state.name=lgstate.name;
                  this.$store.state.isLoggedIn=true;
                  this.$store.state.id = lgstate.id;
                  this.$emit("loggedIn");
              }
              else {
                this.$store.state.errorText = "Access Denied";            
              }
          })
          .catch((e)=>{
              console.log(e);
              this.$store.state.errorText = "Error contacting the backend, please check your connection"
          });
        }
    }
    else {

      google.accounts.id.initialize({
        client_id: this.googleclientid,
        callback: (response) => {
          fetch("/api/login/google/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential }),
          })
          .then(async (response)=>await response.json())
          .then(async (response)=>{
              if (response.success) {
                  let lgstate = {
                      name: response.data,
                      isLoggedIn: true,
                      id: response.id
                  };
                  localStorage.setItem("lgstate", JSON.stringify(lgstate));
                  this.$store.state.name=lgstate.name;
                  this.$store.state.isLoggedIn=true;
                  this.$store.state.id = lgstate.id;
                  this.$emit("loggedIn");
              }
              else {
                  this.$store.state.errorText = "Login failed. Please check your credentials"
              }
          })
          .catch((e)=>{
              console.log(e);
              this.$store.state.errorText = "Error contacting the backend, please check your connection"
          });
        }
     
      });

      google.accounts.id.renderButton(
        document.getElementById("g_id_signin"), {
        theme: 'outline',
        size: 'large'
      });
    }
  
  },
  methods: {
    handleBack() {
        this.$emit('backPanel');
    },
    isStateValid(state) {
        const pestateString = localStorage.getItem('pestate');
        if (pestateString) {
            try {
                const pestate = JSON.parse(pestateString);
                if (!pestate.expiry) {
                    return false;
                }

                return (pestate.value === state && Date.now() - (new Date(pestate.expiry).getTime()) < 600000);
            } 
            catch (e) {
                return false;
            }
        }
        return false;
    },
    login() {
        // Handle login with username and password
        // Configuration
        let oauthredirecturi="https://vetmyidea.biz/";
        if (!this.loadBack) {
           oauthredirecturi="https://vetmyidea.biz/dashboard";
        }

        const clientId = this.oauthclientid;
        const oauthUri = this.oauthuri;
        const scopes = encodeURIComponent(this.oauthscopes);
        const redirectUri = encodeURIComponent(oauthredirecturi);
        const responseType = 'code'; 
        const state = Math.random().toString(36).substring(2, 15); 

        localStorage.setItem("pestate", JSON.stringify({
            value: state,
            expiry: new Date().getTime() + 600000
        }));

        // Construct the OAuth2 URL
        const oauth2Url = `${oauthUri}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;

        // Redirect the user to the OAuth2 URL
        window.location.href = oauth2Url;
    }
  }
}
</script>

<style scoped>
   .login-btn {
      text-transform: none;
      font-family:inherit;
      letter-spacing: normal;
      width:100%;
   }
</style>