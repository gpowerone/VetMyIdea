import OpenAI from 'openai';
import Eml from './email.js'

// Connect to OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI,
});

// Function to send requests and store responses
export default { 

    flagged: false,

    chatGPT: async function (ctxt,requests) {
        try {
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

            if (response.results.flagged) {
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
        // Send request to OpenAI API
        console.log(request);
        try {
            return openai.chat.completions.create({
                model: "gpt-4", 
                messages: [{role: "system", content: ctxt}, {role: "user", content: request}]
            }).then((response)=> {
                console.log(response.choices[0].message.content);
                return response.choices[0].message.content;
            });
        } 
        catch(error) { 

            if (error.response && error.response.status === 429) {
                // in the event of a rate limit error, repeat this request in a minute
                let promiseGPT = new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        this.makeRequest(ctxt,request)
                    resolve(true);
                    }, 60000);
                });
                await promiseGPT;
            }
            else {
                Eml.failMail("Open AI error:"+ error.message);
            }
            return ""; 
        }   
    }      
}

