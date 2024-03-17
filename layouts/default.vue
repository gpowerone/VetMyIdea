<template>
  <v-app>
    <v-layout>

      <v-app-bar class="topbar" role="toolbar">
          <v-app-bar-title>
              <h1 class="title" :class="{'title-xs': $vuetify.display.xs}">
                <NuxtLink to="/">
                    <img src="/images/logo.png" alt="VetMyIdea Logo" height="50" /> 
                </NuxtLink>
              </h1>
          </v-app-bar-title>

          <div class="d-none d-sm-flex pr-5" v-if="name!==null">
              Hello {{name}}!
          </div>

          <template v-slot:append>
            <v-app-bar-nav-icon size="x-large" @click='drawer=!drawer' :aria-expanded="drawer"></v-app-bar-nav-icon>
          </template>

       </v-app-bar>

        <v-main class="relative">     

            <v-alert class="top_pos" role="alert" color="error" icon="$error" :text="errorText" title="Error" v-model="errorText" closable></v-alert>
            <v-alert class="top_pos" role="alert" color="success" icon="$success" :text="successText" title="Success"  v-model="successText" closable></v-alert>

            <v-navigation-drawer role="menu" v-model="drawer" temporary clipped location="right" class="navdrawer" :class="{'navdrawer-xs': $vuetify.display.xs}">
                <v-list>
                    <v-list-item class="menuitem"><NuxtLink role="menuitem" to="/">Home</NuxtLink></v-list-item> 
                    <v-divider />
                    <v-list-item class="menuitem"><NuxtLink role="menuitem" to="/about">About</NuxtLink></v-list-item>            
                    <v-divider />
                    <v-list-item class="menuitem"><NuxtLink role="menuitem" to="/contact">Contact</NuxtLink></v-list-item>            
                    <v-divider />
                    <v-list-item class="menuitem"><NuxtLink role="menuitem" to="https://vetmyidea.blogspot.com/">Blog</NuxtLink></v-list-item>
                    <!--<v-divider />
                    <v-list-item class=" menuitem"><NuxtLink role="menuitem" class="cursor" @click="doLogout">Logout</NuxtLink></v-list-item>//-->
                </v-list>
            </v-navigation-drawer>

            <div class="offsetter fillpage" :class="{'offsetter-xs': $vuetify.display.xs, 'offsetter-sm': $vuetify.display.sm}">
               <slot />
            </div>  

            <div class="footer stdlink mt-3">
              <div class="text-center pt-7 pb-10 force-white-text">
                  <NuxtLink to="/about">About</NuxtLink> | <NuxtLink to="/contact">Contact</NuxtLink> | <NuxtLink to="https://vetmyidea.blogspot.com/">Blog</NuxtLink><br /><br />
                  &copy; 2024 Techfalos, LLC
              </div>
            </div>
        </v-main>
    </v-layout>
  </v-app>
</template>    

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    errorText: {
        get() {
            return this.$store.state.errorText;
        },
        set(newValue) {
            this.$store.state.errorText=newValue;
        }
    },
    name: {
        get() {
            return this.$store.state.name;
        }
    },
    successText: {
        get() {
            return this.$store.state.successText;
        },
        set(newValue) {
            this.$store.state.successText=newValue;
        }
    }
  },
  methods: {
    doLogout() {
        fetch("/api/login/logout", {
            method: "GET",
        })
        .then(async (response)=>await response.json())
        .then(async (response)=>{
           localStorage.removeItem("lgstate");
           this.$store.state.isLoggedIn=false;
           this.$store.state.name=null;
           navigateTo('/');
        })
    },
    keyDownHandler (event) {
      if (event.code === 'Escape') {
        this.drawer = false
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDownHandler)
  },
  setup() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-Z4T5SBW4ZS');
  },
  mounted() {
    window.addEventListener('keydown', this.keyDownHandler)
    let lgstate = localStorage.getItem("lgstate");
    if (lgstate) {
        let lgstateitems = JSON.parse(lgstate);
        this.$store.state.name=lgstateitems.name;
        this.$store.state.isLoggedIn=true;
    }
  }
})
</script>

<style scoped>
  .fillpage {
     min-height:85vh;
  }
  .topbar, .footer {
     background-color: #0c1d36;
     color:#FFF;
  }
  .footer {
    min-height:15vh;
  }
  .footer a {
     text-decoration:underline;
     color:#FFF;
  }
  .navdrawer {
     width:150px !important;
     border-left: 1px solid #0c1d36;
  }
  .menuitem a {
     color: #0c1d36;
  }
  .top_pos {
      position:fixed;
      top:0;
      width:100%;
      z-index:10000;
 }
</style>
          