import OpenAI from 'openai';
import Eml from './email.js'

// Connect to OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI,
});

// Function to send requests and store responses
export default { 

    flagged: false,
    debug: false,

    chatGPT: async function (ctxt,requests) {
        try {
            if (this.flagged) {
                return [];
            }

            let promises=[];

            for (const request of requests) {
                promises.push(this.checkContentForModeration(ctxt,request))
            }

            return Promise.all(promises).then((values)=>{
                let res=[];
                for (const value of values) {
                    res.push(value);
                }
                return res;
            });  

        } catch (error) {
            await Eml.failMail('OpenAI Error:'+ error.message);
            return [];
        }
    },

    checkContentForModeration: async function (ctxt,request) {
        try {
            const response = await openai.moderations.create({input:ctxt+". "+request});

            if (this.debug) {
                console.log("MODERATION: "+response.results[0].flagged);
            }

            if (response.results[0].flagged) {
                 this.flagged=true;       
            } else {
                return await this.makeRequest(ctxt,request);
            }
    
        } catch (error) {
            await Eml.failMail('OpenAI Error:'+ error.message);
            this.flagged=true;
        }

        return ""; 
    },

    makeRequest: async function(ctxt,request) {

        try {
            if (this.debug) {
                console.log("REQUEST MADE");
            }

            return openai.chat.completions.create({
                model: "gpt-4", 
                messages: [{role: "system", content: ctxt}, {role: "user", content: request}],
                temperature: 0.1,
                seed: 512 // it's a power of 2. This probably doesn't matter?
            }).then((response)=> {
                if (this.debug) {
                    console.log("AGENT: "+ctxt+" | REQUEST: " +request+" | RESPONSE: "+response.choices[0].message.content);
                }
                return response.choices[0].message.content;
            });
        } 
        catch(error) { 

            console.log("ERROR: "+error.response);

            if (error.response && error.response.status === 429) {
                console.log("RATE LIMIT RETRY");
                // in the event of a rate limit error, repeat this request in a minute
                let promiseGPT = new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        this.makeRequest(ctxt,request)
                    resolve(true);
                    }, 60000);
                });
                return await promiseGPT;
            }
            else {
                Eml.failMail("Open AI error:"+ error.message);
            }
            return ""; 
        }   
    },
    
    setDebug: function(mode) {
        this.debug=mode;
    }
}

