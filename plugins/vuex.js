import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      errorText: null,
      name: null,
      isLoggedIn: false,
      successText: null
    };
  }
});

export default defineNuxtPlugin((app) => {
  app.vueApp.use(store);
  // Install the store instance as a plugin
});