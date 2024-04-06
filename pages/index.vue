<template>
    <v-container class="wizard"  fluid>
      <v-row>
         <v-col cols="12" lg="7" xs="12" xm="12">
            <h1 class='text-center mt-15'>Coming April 15th, 2024!</h1>

            <h2 class="mt-5 mb-5 text-center">Get a <b>free</b> evaluation of your business idea</h2>

          
            <p class="text-center mt-10"  style='font-size:1.2em;'><b>90%</b> of startups <b>fail</b>. Why yours could be next:</p>
            <div class='mt-5 mb-7' style='text-align:center;'>
               <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
                  <li>An unconvincing value proposition - customers buy your competitors product</li>
                  <li>Incorrect marketing strategy - customers don't know they need your product</li>
                  <li>Weak growth in your industry - no one wants your product</li> 
                  <li>Being unaware of risks</li>
                  <li>Your product is, unbeknownst to you, illegal</li>
               </ul>
            </div>

            <h3 class="text-center mt-15" style="font-size:1.6em;" >Evaluate it <em>before</em> you start. Get a <span style='color:#a32d26;font-weight:bold;'>VetMyIdea Report</span></h3>

            <div class='mt-5 mb-7' style='text-align:center;'>
               <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
                  <li>Potential growth and competitors in your industry</li>
                  <li>Potential risks</li>
                  <li>Evaluation of unique feature, cost-cutting, and marketing strategies</li>
                  <li>Report based on targeted location (city, region, country, or international)</li>
                  <li>VetMyIdea favorability score</li>    
                  <li>Run a report for free in under 5 minutes</li>
               </ul>
            </div>

            <p class='text-center mb-5 mt-15' style='font-size:1.2em'><b>Sample report</b>: we threw the <a href='https://reports.vetmyidea.biz/kitchen_sink_bbb3dcb0-324f-4256-9c8a-e46c14540132.html' target='_blank' rel='noopener noreferrer'>kitchen sink</a> at it!</p>

            <p class='text-center' style='font-size:1.2em;'><b>Want all the latest updates?</b> Join us on <a href='https://discord.gg/4ABJy6n4'>Discord</a> or <a href='/contact'>Contact Us</a></p>

            <p class='text-center mt-5'>
              <a href="https://www.producthunt.com/products/vet-my-idea?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-vet&#0045;my&#0045;idea" target="_blank">
                <img src="/images/ph.svg" 
                alt="Vet&#0032;My&#0032;Idea - Get&#0032;a&#0032;free&#0032;evaluation&#0032;of&#0032;your&#0032;business&#0032;idea | Product Hunt" 
                style="width: 250px; height: 54px;" width="250" height="54" />
              </a>
            </p>

      
      </v-col>
      <v-col cols="12" lg="5" xs="12" sm="12" class='mt-15'>
         <div id='banner' class="mt-15 d-none d-md-none d-lg-flex">
             <img src="/images/phcreative.png" alt="woman sitting at computer using VetMyIdea" />
         </div>
      </v-col>
      </v-row>
      <v-row>
         <v-col cols="12">
                  <hr class="bottom-border mt-15" />

            <div class="mt-7 text-center">
               <div>
                   Vet My Idea will not sell any data about your idea to third parties in accordance with our <a href='/privacy' rel="noopener noreferrer" target='_blank'>Privacy Policy</a>
               </div>
       
               <div class='mt-2'>This tool is for information purposes only. Its output is not advice of <em>any kind</em>. Use at your own risk</div>
            </div>
         </v-col>
      </v-row>
  </v-container>

</template>

<style>
  .bottom-border {
     border-top:1px dashed #0c1d36;
  }
  .market-list {
     font-size:1.2em;
     display: inline-block;
    text-align: left;
  }
</style>