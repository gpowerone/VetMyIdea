import emailtools from './email.js'
import Reports from '../models/report.js' 
import ReportFields from '../models/reportfield.js'
import Gpt from '../utilities/openai.js'
import s3 from './s3.js'
import Page from '../utilities/page.js'

export default {

    productType: "",
    targetLocation: "",
    score: 50,
    reportText: "",
    competitorsNum: 0,
    hadUniqueFeature: false,

    evaluateCompetitors: async function() {
        let results = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional businesses that sell or offer "+this.productType+". "+
        "You only return an array as an answer. "+
        "You do not return an array with more than 25 entries. ",
        ["What are all the businesses you know of that sell or offer "+this.productType+" in "+this.targetLocation+", including national or regional chains that sell or offer "+ this.productType+". "+
        "Do not include big-box retailers or auction sites that might sell competitor products. Be as exhaustive as possible. Return your answer as an array of [\"companyname\"], or an empty array if there are none"],"gpt-4");

        try {
            let parsedResults = JSON.parse(results[0].trim());
            if (parsedResults.length>0) { 
                this.reportText+='"competitors": '+results[0].trim()+',';
                this.competitorsNum=results[0].split(',').length;
                return true;
            }
        }
        catch(e) {
            return false;
        }

        return false;
    },

    evaluateGrowth: async function() {
        try {
            let growth = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional businesses that sell or offer "+this.productType+". "+
            "You write as if you are a 9th grade business class teacher. " +
            "You do not use metaphors or similes. "+
            "You do not refer to yourself. ",
            ["What is the outlook for growth for "+this.productType+" in "+this.targetLocation+" for the next 5 years? "+
            "Use a market growth rate formula in your prediction (((current market size minus original market size at the beginning of the defined time period) / (original market size)) x 100 ). "+
            "Fair is 7-13, good 14-19, very good>19, poor 3-6, and very poor <3. "+
            "You do not refer to the market growth rate in your explanation. "+
            "Give your answer as an object: {\"growth\":\"very good|good|fair|poor|very poor\", \"explanation\":\"explanation\"}"],"gpt-4-turbo-preview");
        
            let parsed=JSON.parse(growth[0].trim());

            parsed.score=0;
            if (parsed.growth.trim().toLowerCase()=='very good') {
                parsed.score=20;
            }
            else if (parsed.growth.trim().toLowerCase()=='good') {
                parsed.score=5;
            }
            else if (parsed.growth.trim().toLowerCase()=='poor') {
                parsed.score=-25;
            }
            else if (parsed.growth.trim().toLowerCase()=='very poor') {
                parsed.score=-50;
            }      

            this.score+=parsed.score;
            this.reportText+='"expectedGrowth": '+JSON.stringify(parsed)+',';
        }
        catch(e) {
            console.log(e);
            return false;
        }
          
    },
    evaluateRegulatoryRisk: async function() {
        try {
            let risk = await Gpt.chatGPT(
                "You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". "+
                "You write as if you are a 9th grade business class teacher. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. ",
            ["What is the risk that the sale of "+this.productType+" in "+this.targetLocation+" will be regulated in the future such that a company selling "+this.productType+" would be illegal?"+ 
            "Give your answer as an object: { \"risk\": \"low|medium|high\", \"explanation\": \"explanation\" }"],"gpt-4-turbo-preview");

            let parsed=JSON.parse(risk[0]);

            parsed.score=0;
            if (parsed.risk.trim().toLowerCase()=='medium') {
                parsed.score=-5;
            }
            if (parsed.risk.trim().toLowerCase()=='high') {
                parsed.score=-15;
            }

            this.score+=parsed.score;
            this.reportText+='"regulatoryRisk": '+JSON.stringify(parsed)+',';
        }
        catch(e) {
            console.log(e);
            return false;
        }

    },

    evaluateField: async function(demarcator,targetStatement,conjunction,benefitStatement,possibilityStatement,field) {
    
        try {

            this.reportText+='"'+demarcator+'": {'

            let possibility = await this.evaluatePossibility(possibilityStatement);
            if (possibility.answer='yes') {

                let legality = await this.evaluateLegality(targetStatement+" "+this.productType+" in "+this.targetLocation+" "+conjunction+" '"+field.FieldValue+"'");
                if (legality.answer=='no') {
               
                    let risk = await this.evaluateRisk(targetStatement+" "+this.productType+" in "+this.targetLocation+" "+conjunction+" '"+field.FieldValue+"'")
        
                    let score=0; 

                    let benefits = await this.evaluateBenefit("'"+field.FieldValue+"'", benefitStatement);
                    let explanation=benefits.explanation;

                    if (benefits.answer>=9) {
                        score+=30;
                        this.hadUniqueFeature=true;
                    }
                    else if (benefits.answer==7) {
                        score+=10;
                        this.hadUniqueFeature=true;
                    }

                    let risk_total = -1*risk.answer*10;
                    if (risk_total<-30) {
                        risk_total=-30;
                    }

                    score+=risk_total;

                    explanation+="<br /><br /><em>Risks</em><br />"+risk.explanation;   

                    this.reportText+='"benefits":"'+explanation+'",';

                    this.score+=score;
                    this.reportText+='"score":'+score+',"evaluatedString":"'+field.FieldValue+'","viable":"yes"},';
                    
                    return true;
                  
                
                }
                else {
                    this.reportText+='"viable":{"evaluatedString":"'+field.FieldValue+'","explanation":"'+legality.explanation+'"}},';
                } 
            }
            else {
                this.reportText+='"viable":{"evaluatedString":"'+field.FieldValue+'","explanation":"'+possibility.explanation+'"}},';
            }
        }
        catch(e) {
            console.log("ERROR: "+e);
            this.reportText+='"viable":{"evaluatedString":"'+field.FieldValue+'","explanation":"An error occurred during report processing. This is normally due to an answer that the processor couldn\'t understand. Please ensure that all answers are reasonable and comprehensible, then try again"}},';
        }

        return false;
    
    },

    evaluateLegality: async function(evaluateString) {

        try {
            let result = await Gpt.chatGPT(
                "You are a lawyer with great knowledge of "+this.productType+". You practice in "+this.targetLocation + ". "+
                "You provide answers with respect to legal facts only. " + 
                "You write as if you are a 9th grade business class teacher. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. ",
                ["To the best of your knowledge as of today, is it illegal to "+evaluateString+"? "+
                "Give your answer as an object of {\"answer\":\"yes|no\", \"explanation\":\"if answer==yes then explanation else null\"}"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }
    },

    evaluatePossibility: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You're an omniscient god. "+
                "You write as if you are a 9th grade business class teacher. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. ",
                ["Is "+evaluateString+" physically possible? Give your answer as {\"answer\":\"yes|no\", \"explanation\":\"explanation if no else null\"}"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }
    },

    evaluateRisk: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are a risk analyst with great knowledge of "+this.productType+". You work in "+this.targetLocation + ". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are a 9th grade business class teacher. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. "+
                "You only give integer scores. "+
                "You don't give scores of 6. If you would give a 6, you always give a 5 instead. ",
                ["Evaluate '"+evaluateString+"' for the following risks, with higher scores meaning most risky. Return only the JSON object with exactly the provided fields as your answer. "+
                "{\"cyber_attacks\":\"score 0 to 10\", \"insider_threats\":\"score 0 to 10\", \"supply_chain_disruptions\":\"score 0 to 10\", \"employee_injury\": \"score 0 to 10\", "+
                "\"inability_to_find_talent\": \"score 0 to 10\", \"customer_injury\": \"0 to 10\", \"answer\":\"number of scores >=7\", \"explanation\":\"explanation of risks broken down by category formatted "+
                "in a numbered list tagged as html (with <ol> and <li> tags), "+
                "without mention of the integer score\"}"],"gpt-4-turbo-preview");

                return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }
    },

    evaluateBenefit: async function(evaluateString,evaluateTarget) {
        try {
            let result = await Gpt.chatGPT(
                "You are an expert on "+this.productType+" in "+this.targetLocation+". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are a 9th grade business class teacher. " +
                "You do not use metaphors or similes. "+
                "You only give positive feedback, no negative feedback. " +
                "You do not refer to yourself. "+
                "You only give integer scores. "+
                "You don't give scores of 8. If you would give an 8, you always give a 7 instead. "+
                "You don't give scores of 6. If you would give a 6, you always give a 5 instead. ",
                ["How does "+evaluateString+" "+evaluateTarget+"? Give your answer as an object, with a score of 0 meaning not at all and a score of 10 meaning the most: "+
                "{ \"answer\":\"score 0 to 10\", \"explanation\":\"explanation\" }"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }

    },

    evaluateFields: async function(field) {

        if (field.FieldType == "Unique Feature") {
           return await this.evaluateField(
                "uniqueFeature",
                "introduce a feature for",
                "that",
                "appeal to users of "+this.productType+" in "+this.targetLocation+"? Base your answer off of how much many users will want to use the feature based upon your knowledge of how popular the feature is ."+
                "Very good=80% or higher,Good=60-80%,Fair=40-60%,Not Good=20-40%,Very Not Good=0-20% ",
                "the following feature for "+this.productType+" - "+field.FieldValue,
                field);
        }
        if (field.FieldType == "Reduced Raw Materials Cost") {
            return await this.evaluateField(
                "rawMaterialsCost",
                "reduce raw materials costs",
                "by",
                "reduce raw materials costs for "+this.productType+" in "+this.targetLocation,
                "following method to reduce raw material costs for "+this.productType+" - "+field.FieldValue,
                field);
        }
        if (field.FieldType == "Reduced Labor Cost") {
            return await this.evaluateField(
                "laborCost",
                "reduce labor costs",
                "by",
                "reduce labor costs for "+this.productType+" in "+this.targetLocation,
                "following method to reduce labor costs for "+this.productType+" - "+field.FieldValue,
                field);
        }
        if (field.FieldType == "Reduced Shipping Cost") {
            return await this.evaluateField(
                "shippingCost",
                "reduce shipping costs",
                "by",
                "reduce shipping costs for "+this.productType+" in "+this.targetLocation,
                "following method to reduce shipping costs for "+this.productType+" - "+field.FieldValue,
                field);
        }

    },
    flagReport: async function(report) {
        report.Flagged=true;
        report.IsProcessing=false;
        await report.save();
    },
    processReport: async function(reportId) {
        try {
            let report = await Reports.findByPk(reportId);
            if (!report) return null;

            // Set debug mode to get GPT output
            Gpt.setDebug(report.IsDebug);

            this.productType=report.ProductType;
            this.targetLocation=report.TargetLocation;
          
            this.reportText='{';

            if (await this.evaluateCompetitors()) {

                let viability=false;

                let productLegality = await this.evaluateLegality("sell "+this.productType+" in "+this.targetLocation);
                if (productLegality.answer=='no') {

                    viability=true;

                    let fields = await ReportFields.findAll({
                        where: {
                        ReportID: reportId
                        }
                    }) 
                    
                    for (const field of fields) {
                        if (viability) {
                            let new_viability = await this.evaluateFields(field);
                            if (Gpt.flagged) {
                                return await this.flagReport(report);
                            }
                            if (!new_viability) {
                                viability=false;
                                this.reportText+='"viable":"no", ';
                            }
                        }
                    }
                }
                else {
                    this.reportText+='"viable":"no", "explanation":"'+productLegality.explanation+"', ";
                }

                if (viability) {
                    this.reportText+='"viable":"yes", ';
                    report.IsViable=true;

                    if (this.competitorsNum>3 && !this.hadUniqueFeature) {
                        this.score-=30;
                    }

                    await this.evaluateGrowth();
                    if (Gpt.flagged) {
                        return await this.flagReport(report);
                    }

                    await this.evaluateRegulatoryRisk();
                    if (Gpt.flagged) {
                        return await this.flagReport(report);
                    }

                    if (this.score<0) this.score=0;
                    if (this.score>100) this.score=100;
                }
                else {
                    this.score=0;
                    report.IsViable=false;
                }
                
                report.Score=this.score;

                // summary
                this.reportText+='"summary": {'
                this.reportText+='"score":'+report.Score+',';
                this.reportText+='"product":"'+report.ProductType+'",';
                this.reportText+='"hadUniqueFeature":'+this.hadUniqueFeature+',';

                if (report.Score>=85) {
                    this.reportText+='"scoremeaning":"Highly Favorable",'
                }
                else if (report.Score>=65) {
                    this.reportText+='"scoremeaning":"Favorable",'
                }
                else if (report.Score>35) {
                    this.reportText+='"scoremeaning":"Fair",'
                }
                else if (report.Score>15) {
                    this.reportText+='"scoremeaning":"Unfavorable",'
                }
                else {
                    this.reportText+='"scoremeaning":"Highly Unfavorable",'
                }
                
                this.reportText+='"title":"'+report.ProductType+' business in '+report.TargetLocation+'"';

                this.reportText+='}, "created":'+Date.now()+'}';    
            
           }
           else {
              if (Gpt.flagged) {
                 return await this.flagReport(report);
              }    
              this.reportText+='"novel":"true", "created":'+Date.now()+'}';
           }

           await Page.createPublicPage(report.ProductType+" business in "+report.TargetLocation, Page.generatePublicPageURL(report.ProductType, report.ReportID),  this.reportText);

           report.IsProcessing=false;
           report.IsReady=true;

           await report.save();

        } catch (error) {
            console.log(error);
            await emailtools.failMail('Process Report Error:'+ error.message);
            return [];
        }

    }
}