<template>
  <v-container class="pa-0 pt-5" :class="{'mt-10':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}" >
    <v-row>
      <v-col cols="12" lg="5">
        <h2 class="mb-5">Login</h2>
        <v-card>
          <v-card-text>
    
            <!-- Google Login -->
            <div id="g_id_signin"></div>
            <v-divider class="mt-5 mb-5" ></v-divider>
            <v-btn @click="login" class="login-btn">Login with Username/Password</v-btn>
         
      
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="2" class="d-md-none d-lg-block">
         &nbsp;
      </v-col>
      <v-col cols="12" lg="5">
        <div :class="{'mt-15':$vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl}">
          <h3>Create An Account</h3>
          <p class="mt-5">
          &bull; Get Your Free Report<br />
          &bull; Create Additional  Free Reports<br />
          &bull; Optionally Share Your Reports<br />
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row>
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

        fetch("/api/login/oauth/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: this.$route.query.code }),
        })
        .then(async (response)=>await response.json())
        .then(async (response)=>{
            if (response.success) {
                this.$store.state.name = response.data;
                this.$store.state.isAdmin = response.isAdmin;
                localStorage.setItem("lgstate", JSON.stringify({
                    name: response.data,
                    isLoggedIn: true
                }));
                this.$store.state.isLoggedIn=true;
            }
            else {
                this.$store.state.errorText = "A failure occurred"
            }
        })
        .catch(()=>{
            this.$store.state.errorText = "Error contacting the backend, please check your connection"
        });
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
                  this.$store.state.name = response.data;
                  this.$store.state.isAdmin = response.isAdmin;
                  localStorage.setItem("lgstate", JSON.stringify({
                      name: response.data,
                      isLoggedIn: true
                  }));
                  this.$store.state.isLoggedIn=true;
              }
              else {
                  this.$store.state.errorText = "Login failed. Please check your credentials"
              }
          })
          .catch(()=>{
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
        const clientId = this.oauthclientid;
        const oauthUri = this.oauthuri;
        const scopes = encodeURIComponent(this.oauthscopes);
        const redirectUri = encodeURIComponent(this.oauthredirecturi);
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