<template>
    <v-container class="pa-0 mt-7 wizard" :class="{'wizard-mobile': !($vuetify.display.lg||$vuetify.display.xl||$vuetify.display.xxl)}">
        <h2>Contact</h2>
        <p>Send a message below. For more immediate help, try joining our <a href="https://discord.gg/4ABJy6n4">Discord</a></p>
        <v-form class="mt-5">
            <v-text-field class="field" label="Your Email Address" v-model="email" />
            <v-textarea class="mt-3 field" label="Message" v-model="message" />
            <div 
              id="g-recaptcha-contact"
              class="g-recaptcha-contact mt-3"
              :data-sitekey="sitekey"
            />
            <v-btn class="mt-5" role="button" @click="submitContact" :disabled="isLoading">Submit</v-btn>
            <spinner class="mt-5" :isLoading="isLoading" />  
        </v-form>
    </v-container>
</template>
<script>
import Spinner from '../components/spinner.vue';

export default {
  data() {
    return {
      email: '',
      isLoading: false,
      message: '',
      widgetId: 0,
    };
  },
  computed: {
    sitekey() {
      return useRuntimeConfig().public.recaptchaSitekey
    }
  },
  mounted() {
    this.render()
  },
  methods: {
    execute () {
      window.grecaptcha.execute(this.widgetId, { action: 'contact'})
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)
    },
    render () {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha-contact', {
          sitekey: this.sitekey,
        })
      }
    },
    async submitContact() {

      this.$store.state.errorText=null;
      this.$store.state.successText=null;
      this.isLoading=true;

      try {
        const token = window.grecaptcha.getResponse();
        if (token.length>0) {
          const response = await fetch(useRuntimeConfig().public.envUrl+'/api/contact/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email, message: this.message, token: token })
          });
          this.isLoading=false; 

          if (!response.ok) {
            this.$store.state.errorText='An error occurred';
            this.reset();
          }
          else {
            let res = await response.text();
            let msg = JSON.parse(res).message;
            if (msg==="OK") {
              this.$store.state.successText="Message sent successfully";
              this.email="";
              this.message=""; 
            }
            else {
              this.$store.state.errorText=msg;
            }
            this.reset();
          }
        }
        else {
          this.$store.state.errorText='CAPTCHA response required';
        }

      } catch (error) {
        this.$store.state.errorText='An error occurred: '+error.message;
        this.reset();
      }
    }
  }
};
</script>