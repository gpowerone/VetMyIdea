<template>
  <v-container class="pa-0" :class="{'mt-10':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}" >
    <v-row>
      <v-col cols="12" :lg="smlcol" class="d-none d-sm-flex" >
          &nbsp;
      </v-col>
      <v-col cols="12" :lg="bigcol"  >
        <h2 class="mb-5 mt-10 text-center">Login</h2>
        <p class="mt-5 text-center">Get up to 3 <b>free</b> reports a day</p>
        <v-card class="mt-5 loginCard">
          <v-card-text>
        
            <!-- Google Login -->
            <div id="g_id_signin" class="login-btn"></div>
            
            <!-- Linkedin Login -->
            <v-btn @click="linkedIn" class="mt-5 login-btn">
              <v-container class="pa-0" fluid>
                <v-row class="pa-0">
                   <v-col class="text-left" cols="1" ><v-icon :icon="mdiLinkedin" /></v-col>
                   <v-col cols="10" class="text-center pl-8">Sign in with LinkedIn</v-col>
                   <v-col cols="1">&nbsp;</v-col>
                </v-row>
              </v-container>
            </v-btn>

            <!-- Username Password -->
            <v-btn @click="login" class="mt-5 login-btn">
              <v-container class="pa-0" fluid>
                <v-row class="pa-0">
                   <v-col class="text-left" cols="1" ><v-icon :icon="mdiLock" /></v-col>
                   <v-col cols="10" class="text-center pl-8">Sign in with Username/Password</v-col>
                   <v-col cols="1">&nbsp;</v-col>
                </v-row>
              </v-container>
            </v-btn>
         
      
          </v-card-text>
        </v-card>
        <p class="loginCard mt-7 text-center">By creating an account or logging in, you agree to our<br /><NuxtLink to="/privacy">Privacy Policy</NuxtLink> and <NuxtLink to="/terms">Terms of Service</NuxtLink></p>
      </v-col>
      <v-col cols="12" :lg="smlcol" class="d-none d-sm-flex" >
          &nbsp;
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
  import { mdiArrowLeft,mdiLinkedin,mdiLock } from '@mdi/js'
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
    },
    linkedinclientid() {
      return useRuntimeConfig().public.linkedinClient
    },
    smlcol() {
       return this.loadBack?2:4;
    },
    bigcol() {
       return this.loadBack?8:4;
    }
  },
  mounted() {

    let type = this.isStateValid(this.$route.query.state);
    if (type.valid) {
        localStorage.removeItem('pestate');

        if (this.$route.query.error_description && this.$route.query.error_description=="Please verify your email before continuing.") {
            this.$store.state.successText = "Please verify your email address and then log in again";
        } 
        else {
          fetch("/api/login/"+(type.type==="oauth"?"oauth/":"linkedin/"), {
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

                return {
                  valid: pestate.value === state && Date.now() - (new Date(pestate.expiry).getTime()) < 600000,
                  type: pestate.type
                };
            } 
            catch (e) {
                return false;
            }
        }
        return false;
    },

    linkedIn() {
        // Handle login with username and password
        // Configuration 
        let oauthredirecturi="https://vetmyidea.biz/";
        if (!this.loadBack) {
           oauthredirecturi="https://vetmyidea.biz/dashboard";
        }
 
        const clientId = this.linkedinclientid;
        const scopes = encodeURIComponent(this.oauthscopes);
        const redirectUri = encodeURIComponent(oauthredirecturi);
        const responseType = 'code'; 
        const state = Math.random().toString(36).substring(2, 15); 

        localStorage.setItem("pestate", JSON.stringify({
            value: state,
            expiry: new Date().getTime() + 600000,
            type: "linkedin"
        }));

        // Construct the OAuth2 URL
        const oauth2Url = `https://www.linkedin.com/oauth/v2/authorization?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;

        // Redirect the user to the OAuth2 URL
        window.location.href = oauth2Url;
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
            expiry: new Date().getTime() + 600000,
            type: "oauth"
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
      display:block;
      text-transform: none;
      font-family:inherit;
      letter-spacing: normal;
      background:#FFF;
      color: #000;
      padding-top:5px;
      width:100%;
   }
</style>