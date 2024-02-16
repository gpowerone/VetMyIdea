<template>
    <v-container fluid>
       
        <div class="panel" v-if="panelOpt===0">  
    
            <v-select
                v-model="monetize"
                :items="monetizeOptions"
                label="How do you plan to monetize your idea?"
                outlined
                class="mt-3"
            ></v-select>
            
            <div v-if="monetize==='Accept donations'">
                As the reasons why people donate are almost entirely subjective in many cases, it's hard to provide an answer as to whether or not people will donate to your cause.
                While we cannot vet your idea, we encourage you proceed with causes that you're passionate about. 
            </div>

            <div v-if="monetize==='I do not plan to monetize my idea'">
                Implementing your idea probably won't be free. You should strongly consider monetizing your idea to cover the costs.
            </div>

            <v-btn v-if="monetize==='Sell a product or service'" @click="advancePanel">
                Next -&gt;
            </v-btn>
     
        </div>

        <div class="panel" v-if="panelOpt===1">
            <v-text-field label="Describe the product or service you're selling in five words or less" />
            <p>
                Give us only the product or service (e.g. 'golf club' or 'email marketing'). Don't add the features that make your product or service unique here (we'll get to that in the next step). 
            </p>
            <v-btn @click="advancePanel">
                Next -&gt;
            </v-btn>
        </div>


        <div class="panel" v-if="panelOpt===2">
            Check any of the boxes below that describe how your idea will sell the product or service better than the competition

            My production or service costs are cheaper than my competitors
            My product or service has feature(s) customers want but competitors don't have (or do poorly)
            My product or service isn't unique, I just want to see if it would be a good idea to start a business right now
            My idea is totally novel and there is no competition
            
        
        </div>

        <!--
        <div>Get a summary report on your idea for free. Pay $9.99 for a full report or purchase a subscription to get multiple reports on a monthly basis</div>

        <div>What you get in the full report:<br />
             Score and rank for your idea
             List of competitors
             List of potential risks/threats
             Growth trend in the industry
             Features that customers are looking for in similar products/services      
         </div>
         //-->
  </v-container>
</template>

<script>
export default {
  name: 'VetMyIdeaHome',
  data() {
    return {
      panelOpt: 0,
      monetize: null,
      monetizeOptions: ["Sell a product or service","Accept donations","I do not plan to monetize my idea"]
    };
  },
  methods: {
     advancePanel() {
         this.panelOpt++;
     }
  }
};
</script>