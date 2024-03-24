<template>
    <v-container class="wizard"  fluid>
      <v-row>
         <v-col cols="12" lg="7" xs="12" xm="12">
            <h1 class='text-center mt-15'>Coming April 9th, 2024!</h1>

            <h2 class="mt-10 mb-5 text-center">Get a <b>free</b> evaluation of your business idea</h2>

            <p class="text-center mt-10" style='font-size:1.2em;'>Evaluate it <em>before</em> you start. Save time and money! Get a <span style='color:#a32d26;font-weight:bold;'>Vet My Idea Report</span>:</p>

            <div class='mt-5 mb-15' style='text-align:center;'>
               <ul class='market-list' :class="{'ml-7': $vuetify.display.xs}">
                  <li>Report based on targeted location (city, region, country, or international)</li>
                  <li>Potential growth in your industry</li>
                  <li>Potential competitors</li>
                  <li>Potential risks</li>
                  <li>Evaluation of unique feature/value-proposition</li>
                  <li>Evaluation of cost-cutting measures</li>
                  <li>Favorability score</li>    
                  <li>Optionally share your report</li>
                  <li>Run a report in under 5 minutes</li>
                  <li>No waitlist! Vet My Idea will be fully-functional on launch day</li>
               </ul>
            </div>

            <p class='text-center' style='font-size:1.2em;'><b>Want all the latest updates?</b> Join us on <a href='https://discord.gg/4ABJy6n4'>Discord</a> or <a href='/contact'>Contact Us</a></p>

            <p class='text-center mt-15'>
              <a href="https://www.producthunt.com/products/vet-my-idea?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-vet&#0045;my&#0045;idea" target="_blank">
                <img src="/images/ph.svg" 
                alt="Vet&#0032;My&#0032;Idea - Get&#0032;a&#0032;free&#0032;evaluation&#0032;of&#0032;your&#0032;business&#0032;idea | Product Hunt" 
                style="width: 250px; height: 54px;" width="250" height="54" />
              </a>
            </p>

      
      </v-col>
      <v-col cols="12" lg="5" xs="12" sm="12" class='mt-15'>
         <div id='banner' class="mt-15 d-none d-md-none d-lg-flex">
           <img src='/images/screenshot3.png' width='100%' alt='product screenshot 3'  />
           <img src='/images/screenshot2.png' width='100%' alt='product screenshot 2'  />
           <img src='/images/screenshot1.png' width='100%' alt='product screenshot 1'  />
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
  .wizard button {
      background-color: #0c1d36;
      color:#FFF;
  }
  .wizard .field {
      border: 1px solid #0c1d36;
      background: #FFF;
  }
  .wizard .field-select {
      border-radius: 10px;
  }

  @-webkit-keyframes cf4FadeInOut {
 0% {
   opacity:1;
 }
 17% {
   opacity:1;
 }
 25% {
   opacity:0;
 }
 92% {
   opacity:0;
 }
 100% {
   opacity:1;
 }
}

@-moz-keyframes cf4FadeInOut {
 0% {
   opacity:1;
 }
 17% {
   opacity:1;
 }
 25% {
   opacity:0;
 }
 92% {
   opacity:0;
 }
 100% {
   opacity:1;
 }
}

@-o-keyframes cf4FadeInOut {
 0% {
   opacity:1;
 }
 17% {
   opacity:1;
 }
 25% {
   opacity:0;
 }
 92% {
   opacity:0;
 }
 100% {
   opacity:1;
 }
}

@keyframes cf4FadeInOut {
 0% {
   opacity:1;
 }
 17% {
   opacity:1;
 }
 25% {
   opacity:0;
 }
 92% {
   opacity:0;
 }
 100% {
   opacity:1;
 }
}

#banner{
  position:relative;
  width:80%;
}
#banner img {
  position:absolute;
  left:0;
}

#banner img {
  -webkit-animation-name: cf4FadeInOut;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-duration: 8s;

  -moz-animation-name: cf4FadeInOut;
  -moz-animation-timing-function: ease-in-out;
  -moz-animation-iteration-count: infinite;
  -moz-animation-duration: 8s;

  -o-animation-name: cf4FadeInOut;
  -o-animation-timing-function: ease-in-out;
  -o-animation-iteration-count: infinite;
  -o-animation-duration: 8s;

  animation-name: cf4FadeInOut;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 8s;
}
#banner img:nth-of-type(3) {
  -webkit-animation-delay: 0s;
  -moz-animation-delay: 0s;
  -o-animation-delay: 0s;
  animation-delay: 0s;
}
#banner img:nth-of-type(2) {
  -webkit-animation-delay: 2s;
  -moz-animation-delay: 2s;
  -o-animation-delay: 2s;
  animation-delay: 2s;
}
#banner img:nth-of-type(1) {
  -webkit-animation-delay: 4s;
  -moz-animation-delay: 4s;
  -o-animation-delay: 4s;
  animation-delay: 4s;
}


</style>