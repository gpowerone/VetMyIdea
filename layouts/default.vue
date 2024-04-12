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

          <div class="d-none d-sm-flex pr-10" v-if="name!==null">
              Hello {{name}}!
          </div>

          <div class="d-none d-sm-flex pr-5" v-if="remaining!==null">
              <span v-tooltip="'Number of reports remaining. You get up to 3 free reports per day.'"><span class="remaining_number">{{remaining}}</span> <v-icon :icon="mdiFileChartOutline" /></span>
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
                    <v-list-item class="menuitem"><NuxtLink role="menuitem" to="/"><v-icon :icon="mdiHome" />&nbsp;&nbsp;Home</NuxtLink></v-list-item> 
                    <v-divider />
                     <v-list-item class="menuitem"><NuxtLink role="menuitem" to="/dashboard"><v-icon :icon="mdiFileDocumentMultiple" />&nbsp;&nbsp;My Reports</NuxtLink></v-list-item> 
                    <v-divider v-if="$store.state.isLoggedIn" />
                    <v-list-item v-if="$store.state.isLoggedIn" class="menuitem"><NuxtLink role="menuitem" class="cursor" @click="doLogout"><v-icon :icon="mdiLogout" />&nbsp;&nbsp;Logout</NuxtLink></v-list-item>
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

<script setup>
import { mdiHome, mdiLogout, mdiFileDocumentMultiple, mdiFileChartOutline } from '@mdi/js'
</script>

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
    remaining: {
       get() {
          return this.$store.state.remaining;
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
        fetch("/api/login/logout/", {
            method: "POST",
        })
        .then(async (response)=>await response.json())
        .then(async (response)=>{
           localStorage.removeItem("lgstate");
           this.$store.state.isLoggedIn=false;
           this.$store.state.name=null;
           this.$store.state.id=null;
           this.$store.state.successText="Successfully Logged Out";
           this.drawer=false;
           this.remaining=null;
           navigateTo('/');
        })
    },
    keyDownHandler (event) {
      if (event.code === 'Escape') {
        this.drawer = false
      }
    },
    parseState(lgstate) {
      this.$store.state.name=lgstate.name;
      this.$store.state.isLoggedIn=true;
      this.$store.state.id = lgstate.id;

      fetch("/api/user/get", {
            method: "GET",
      })
      .then(async (response)=>await response.json())
      .then(async (response)=>{
            if (response.success) {
                this.$store.state.remaining = response.message;
            }
 
      });
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDownHandler)
  },  
  mounted() {
    window.addEventListener('keydown', this.keyDownHandler)
    let lgstate = localStorage.getItem("lgstate");
    if (lgstate) {
       let lgstateitems = JSON.parse(lgstate);
        this.parseState(lgstateitems);
    }
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Z4T5SBW4ZS');
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
     width:250px !important;
     background-color: #0c1d36;
     border-left: 1px solid #FFF;
     border-top:1px solid #FFF;
     padding-top:25px;
     padding-left:25px;
  }
  .menuitem a {
     color: #fefcf7;
     text-decoration:none;
     font-size:1.1em;
  }
  .menuitem {
    margin-bottom:10px;
  }
  .top_pos {
      position:fixed;
      top:0;
      width:100%;
      z-index:10000;
 }
</style>

<style scoped>
    .cursor {
        cursor:pointer;
    }
    .remaining_number {
        font-size:1.1em;
        vertical-align:middle;
    }
</style>