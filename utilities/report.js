import emailtools from './email.js'
import Reports from '../models/report.js' 
import ReportFields from '../models/reportfield.js'
import User from '../models/user.js'
import Gpt from '../utilities/openai.js'
import Page from '../utilities/page.js'
import sequelize from '../models/index.js'

export default {

    reportdata: {
        productType: "",
        targetLocation: "",
        bizType: "",
        isPlatform: false,
        isFranchise: false,
        competitors:[],
        growth:{stoplight:3,text:null},
        regulatoryrisk:{stoplight:3,text:null},
        evaluee:{stoplight:3,clarity:null,legality:null},
        marketing:{stoplight:3,text:null},
        cost:{stoplight:3,text:null},
        feature:{stoplight:3,text:null},
        finances:{stoplight:3,text:null},
        requirements:null,
        registerbusiness:null,
        tipstricks:null,
        created: Date.now()
    },

    deductUser: async function(userID) {

        const t2 = await sequelize.transaction();
        let user = await User.findOne({
            where: {
                UserID: userID
            },
            transaction: t2,
            lock: true,
        })
        if (user) {
            if (user.IsUnlimited==false && user.Remaining<=0) {
                await t2.commit();
                return false;
            }
            else {
                if (user.IsUnlimited==false) {
                    user.Remaining-=1;
                    await user.save({transaction: t2});
                }
                await t2.commit();
                return true;
            }
        }
        else {
            await t2.commit();
            return false;
        }
    },

    evaluateCompetitors: async function(productType,targetLocation) {
        let results = await Gpt.chatGPT("You are an expert on '"+productType+"' in "+targetLocation + ". "+
        "You only return an array as an answer. "+
        "You do not return an array with more than 10 entries. If there are more than 10 entries, you pick the 10 largest ones to the best of your knowledge. ",
        ["What are all the businesses you know of that sell or offer '"+productType+"' in "+targetLocation+", including national or regional chains that sell or offer '"+ productType+"'. "+
        "Do not include big-box retailers or auction sites that might sell competitor products. Be as exhaustive as possible. Return your answer as an array of [\"companyname\"], or an empty array if there are none"],"gpt-4-turbo-preview");

        try {
            let parsedResults = JSON.parse(results[0].trim());
            if (parsedResults.length>0) { 
                this.reportdata.competitors = parsedResults;
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
            let growth = await Gpt.chatGPT("You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation + ". "+
            "You write as if you are providing direct consultation on a business idea. " +
            "You do not use metaphors or similes. "+
            "You don't refer to any part of the prompt in written explanations. "+
            "You do not refer to yourself. ",
            ["What is the outlook for growth for "+this.reportdata.productType+" in "+this.reportdata.targetLocation+" for the next 5 years? "+
            "Use a market growth rate formula in your prediction (((current market size minus original market size at the beginning of the defined time period) / (original market size)) x 100 ). "+
            "Fair is 7-13, good 14-19, very good>19, poor 3-6, and very poor <3. "+
            "You do not refer to the market growth rate in your explanation. "+
            "Give your answer as an object: {\"growth\":\"very good|good|fair|poor|very poor\", \"explanation\":\"explanation\"}"],"gpt-4-turbo-preview");
        
            let parsed=JSON.parse(growth[0].trim());

            this.reportdata.growth.text=parsed.explanation!==null?parsed.explanation.replaceAll('"','&apos;'):null;
    
            if (parsed.growth.trim().toLowerCase()=='poor' || parsed.growth.trim().toLowerCase()=='very poor') {
                this.reportdata.growth.stoplight=1;
            }
       
        }
        catch(e) {
            console.log(e);
            return false;
        }
          
    },
    evaluateRegulatoryRisk: async function() {
        try {
            let risk = await Gpt.chatGPT(
                "You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation + " including national or regional business that sell or offer "+this.reportdata.productType+". "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. ",
            ["What is the risk that the sale of "+this.reportdata.productType+" in "+this.reportdata.targetLocation+" will be regulated in the future such that a company selling "+this.reportdata.productType+" would be illegal?"+ 
            "Give your answer as an object: { \"risk\": \"low|medium|high\", \"explanation\": \"explanation\" }"],"gpt-4-turbo-preview");

            let parsed=JSON.parse(risk[0]);

            this.reportdata.regulatoryrisk.text=parsed.explanation!==null?parsed.explanation.replaceAll('"','&apos;'):null;
        
            if (parsed.risk.trim().toLowerCase()=='medium') {
                this.reportdata.regulatoryrisk.stoplight=2;
            }
            if (parsed.risk.trim().toLowerCase()=='high') {
                this.reportdata.regulatoryrisk.stoplight=1;
            }

        }
        catch(e) {
            console.log(e);
            return false;
        }

    },

    evaluateField: async function(targetStatement,conjunction,benefitStatement,possibilityStatement,evalUniqueness,field,rd) {
    
        try {

            let possibility = await this.evaluatePossibility(possibilityStatement);
            if (possibility.answer=='no') {

                let ridiciulousness = await this.evaluateRidiculousness(field.FieldValue);
                if (ridiciulousness.score<8) {

                    let legality = await this.evaluateLegality(targetStatement+" "+this.reportdata.productType+" in "+this.reportdata.targetLocation+" "+conjunction+" '"+field.FieldValue+"'");
                    if (legality.answer=='no') {    
                
                        let stoplight=3;

                        let uniqueness=null;
                        if (evalUniqueness) {
                            uniqueness = await this.evaluateBenefitUniqueness(field.FieldValue);
                        }
                        else {
                            uniqueness = await this.evaluateDrawback(field.FieldValue);
                        }

                        let explanation=""; 
                        if (uniqueness.answer=='no') {
        
                            let benefits = await this.evaluateBenefit("'"+field.FieldValue+"'", benefitStatement);
                            if (benefits.answer<=5) {
                                stoplight=2;
                            }

                            explanation+=benefits.explanation;
                
                            let risk = await this.evaluateRisk(targetStatement+" "+this.reportdata.productType+" in "+this.reportdata.targetLocation+" "+conjunction+" '"+field.FieldValue+"'")

                            if (risk.explanation!==null) {
                                stoplight=2;
                                explanation+="<br /><br /><em>Potential Risks</em><br />"+risk.explanation!==null?risk.explanation.replaceAll('"','&apos;'):null;  
                            }
                            
                        }
                        else {
                            
                            stoplight=2;
                            if (evalUniqueness) {
                                explanation+="<br /><br /><em>Uniqueness</em><br />This feature is common and may not stand out<br /><br />"+uniqueness.explanation!==null?uniqueness.explanation.replaceAll('"','&apos;'):null;
                            }
                            else {
                                explanation+=uniqueness.explanation;
                            }
                            
                        }
                        
                        return { stoplight: stoplight, text: explanation!==null?explanation.replaceAll('"','&apos;'):null, input: field.FieldValue };
                    }            

                    else {
                        return { stoplight:1, text: legality.explanation!==null?legality.explanation.replaceAll('"','&apos;'):null, input: field.FieldValue };
                    } 
                }
                else {
                    return { stoplight:1, text: ridiciulousness.explanation!==null?ridiciulousness.explanation.replaceAll('"','&apos;'):null, input: field.FieldValue };
                }
            }
            else {
                return { stoplight:1, text: possibility.explanation!==null?possibility.explanation.replaceAll('"','&apos;'):null, input: field.FieldValue };
            }
        }
        catch(e) {
            console.log("ERROR: "+e);
            this.reportText+='"viable":{"evaluatedString":"'+field.FieldValue+'","explanation":"An error occurred during report processing. This is normally due to an answer that the processor couldn\'t understand. Please ensure that all answers are reasonable and comprehensible, then try again"}},';
        }

        return false;
    
    },

    evaluateClarity: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are an omniscient god. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not give scores of 3. If you would give a score of 3, you analyze further and give a 2 or 4 instead. "+
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. ",
                ["If I told you I was selling a '"+evaluateString+"' as a product or service, how clear is it what I am selling? "+
                "Give your answer as a score from 1 to 10, with 1 being least clear and 10 being most clear. "+
                "An example score of 1 would be 'a thing', an example score of two would be 'a wizard', an example score of 5 would be 'a wizard figurine' and an example score of 10 would be 'a steel 3/4 screw'." +
                "Return your answer as an object: {\"score\":\"1 to 10\",\"explanation\":\"explanation if score<=2 else null\"}"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }
    },

    evaluateLegality: async function(evaluateString) {

        try {
            let result = await Gpt.chatGPT(
                "You are a lawyer with great knowledge of "+this.reportdata.productType+". You practice in "+this.reportdata.targetLocation + ". "+
                "You provide answers with respect to legal facts only. " + 
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. ",
                ["Is it illegal to '"+evaluateString+"'? "+
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
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. ",
                ["Does something in this statement '"+evaluateString+"' violate the laws of physics? Give your answer as {\"answer\":\"yes|no\", \"explanation\":\"explanation if yes else null\"}"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }
    },

    evaluateRidiculousness: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation + ". "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. "+
                "You do not give scores of 8. If you would give a score of 8, you analyze further and give a 7 or 9 instead ",
                ["If the statement 'the sun rises every morning' is an example of a 1 and 'cows sponataneously growing wings and flying to Mars' is a 10, how does the statement '"+evaluateString+"' rank on a ridculousness scale 1-10? " + 
                "Give your answer as an object: {\"score\":\"1 to 10\", \"explanation\":\"explanation if score>=9 else null\"}"],"gpt-4-turbo-preview");
 
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
                "You are a risk analyst with great knowledge of "+this.reportdata.productType+". You work in "+this.reportdata.targetLocation + ". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. "+
                "You only give integer scores. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You don't give scores of 7. If you would give a 7, you must analyze further to determine if it is more of a 8 or a 6. ",
                ["Evaluate '"+evaluateString+"' for the following risks. A score of 1 means 'totally harmless', a score of 10 means 'the risk will certainly cause a business selling "+this.reportdata.productType+" to fail' "+
                "Return only the JSON object with exactly the provided fields as your answer. "+
                "{\"cyber_attacks\":\"1 to 10\", \"insider_threats\":\"1 to 10\", \"supply_chain_disruptions\":\"1 to 10\", \"employee_injury\": \"1 to 10\", "+
                "\"inability_to_find_talent\": \"1 to 10\", \"answer\":\"number of scores >=8\", \"explanation\":\"explanation of risks with score>=8 broken down by category formatted "+
                "in a numbered list tagged as html (with <ol> and <li> tags), "+
                "without mention of the integer score. If there is no score>=8 this field is null\"}"],"gpt-4-turbo-preview");

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
                "You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation+". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You only give positive feedback, no negative feedback. " +
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. "+
                "You only give integer scores. "+
                "You don't give scores of 8. If you would give an 8, you must analyze further to determine if it is more of a 9 or a 7 "+
                "You don't give scores of 6. If you would give a 6, you must analyze further to determine if it is more of a 7 or a 5. ",
                ["How does "+evaluateString+" "+evaluateTarget+"? Give your answer as an object, with a score of 1 meaning not at all and a score of 10 meaning the most: "+
                "{ \"answer\":\"1 to 10\", \"explanation\":\"explanation\" }"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
        }
        catch(e) {
            console.log(e);
            return null;
        }

    },

    evaluateBenefitUniqueness: async function(evaluateString) {
         try {
            let result = await Gpt.chatGPT(
                "You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation+". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. "+
                "You don't refer to percentages in your explanations. ",
                ["Does "+evaluateString+" appear in more than 50% of "+this.reportdata.productType+" on the market currently? Give your answer as an object: "+
                "{ \"answer\":\"yes|no\", \"explanation\":\"explanation if answer==yes\" }"],"gpt-4-turbo-preview");

            return JSON.parse(result[0].trim());
         }
         catch(e) {
            console.log(e);
            return null;
         }
    },


    evaluateDrawback: async function(evaluateString) {
        try {
           let result = await Gpt.chatGPT(
               "You are an expert on "+this.reportdata.productType+" in "+this.reportdata.targetLocation+". "+
               "You provide answers with respect to objective data only. "+
               "You write as if you are providing direct consultation on a business idea. " +
               "You do not use metaphors or similes. "+
               "You don't refer to any part of the prompt in written explanations. "+
               "You do not refer to yourself. "+
               "You only give negative explanations. ",
               ["Does "+evaluateString+" make "+this.reportdata.productType+" less competitive on the market in "+this.reportdata.targetLocation+"? Give your answer as an object: "+
               "{ \"answer\":\"yes|no\", \"explanation\":\"explanation if answer==yes\" }"],"gpt-4-turbo-preview");

           return JSON.parse(result[0].trim());
        }
        catch(e) {
           console.log(e);
           return null;
        }
   },

   evaluateFinance: async function(money,evaluateString) {

        try {
            let result = await Gpt.chatGPT(
                "You are an expert on '"+evaluateString+"'"+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. ",
                ["A person has '"+money+" dollars' and wants to become a '"+evaluateString+"'. Does this person have enough money to start up the business plus six months of anticipated expenses. Give your answer as a JSON object: {'answer':'yes|maybe|no','explanation':'explanation'}"],"gpt-4-turbo-preview");
        
            let json = JSON.parse(result[0].trim());

            if (json.answer=='yes') {
                this.reportdata.finances.stoplight=3;
            }
            if (json.answer=='maybe') {
                this.reportdata.finances.stoplight=2;
            }
            if (json.answer=='no') {
                this.reportdata.finances.stoplight=1;
            }
            this.reportdata.finances.text=json.explanation!==null?json.explanation.replaceAll('"','&apos;'):null;
            this.reportdata.finances.input=money;
        }
        catch(e) {
            console.log(e);
            return null;
        }
        
   },

   registerBusiness: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are an expert on '"+evaluateString+"'"+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You output paragraphs surrounded with <p> tags and lists with <ul/<ol> and <li> tags. " +
                "You do not output line breaks in your output. "+
                "You do not refer to yourself. ",
                ["What are some options on registering a business as a '"+evaluateString+"'? Provide the pros and cons of registering a business"],"gpt-4-turbo-preview");

            return result[0].trim().replaceAll('"','&apos;');
        }
        catch(e) {
            console.log(e);
            return null;
        }
   },

   tipsTricks: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are an expert on '"+evaluateString+"'"+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You output paragraphs surrounded with <p> tags and lists with <ul/<ol> and <li> tags. " +
                "You do not output line breaks in your output. "+
                "You do not refer to yourself. ",
                ["What are some tips and tricks to be effective at '"+evaluateString+"'?"],"gpt-4-turbo-preview");

            return result[0].trim().replaceAll('"','&apos;');
        }
        catch(e) {
            console.log(e);
            return null;
        }
   },

   requirements: async function(evaluateString) {
        try {
            let result = await Gpt.chatGPT(
                "You are an expert on '"+evaluateString+"'"+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You output paragraphs surrounded with <p> tags and lists with <ul/<ol> and <li> tags. " +
                "You do not output line breaks in your output. "+
                "You do not refer to yourself. ",
                ["What are the requirements to become a '"+evaluateString+"'"],"gpt-4-turbo-preview");

            return result[0].trim();
        }
        catch(e) {
            console.log(e);
            return null;
        }
   },


   evaluateFields: async function(field) {

        if (field.FieldType == "Unique Feature") {
           this.reportdata.feature = await this.evaluateField(
                "introduce a feature for",
                "that",
                "appeal to users of "+this.reportdata.productType+" in "+this.reportdata.targetLocation+"? Base your answer off of how much many users will want to use the feature based upon your knowledge of how popular the feature is. ",
                "the following feature for "+this.reportdata.productType+" - "+field.FieldValue,
                true,
                field);
        }
        if (field.FieldType == "Cost") {
            this.reportdata.cost = await this.evaluateField(
                "reduce costs",
                "by",
                "reduce costs for "+this.reportdata.productType+" in "+this.reportdata.targetLocation,
                "following method to reduce costs for "+this.reportdata.productType+" - "+field.FieldValue,
                false,
                field);
        }
        if (field.FieldType == "Marketing") {
            this.reportdata.marketing = await this.evaluateField(
                "market",
                "by",
                "market "+this.reportdata.productType+" in "+this.reportdata.targetLocation,
                "following method to market "+this.reportdata.productType+" - "+field.FieldValue,
                false,
                field);
        }
    },
    flagReport: async function(report,t1) {
        report.Flagged=true;
        report.IsProcessing=false;
        await report.save({transaction: t1});
        await t1.commit();
    },
    processReport: async function(reportId) {

        try {
            const t1 = await sequelize.transaction();
            let report = await Reports.findOne({
                where: {
                    ReportID: reportId
                },
                transaction: t1,
                lock: true,
                skipLocked: true
            });

            if (!report) {
                await t1.rollback();
                return null;
            }

            if (!await this.deductUser(report.UserID)) {
                report.IsProcessing=false;
                report.IsDelayed=true;
                await report.save({transaction: t1});
                await t1.commit();
                return null;
            }

            // Set debug mode to get GPT output
            Gpt.setDebug(report.IsDebug);

            this.reportdata.productType=report.ProductType;
            this.reportdata.targetLocation=report.TargetLocation;
            this.reportdata.isPlatform=report.IsPlatform;
            this.reportdata.isFranchise=report.IsFranchise;

            if (report.BusinessType==="online") {
                this.reportdata.bizType="Online Business";
            }
            else if (report.BusinessType==="contractor") {
                this.reportdata.bizType="Independent Contractor";
            }
            else {
                this.reportdata.bizType="Brick and Mortar Store";
            }
          
            if (this.reportdata.isPlatform===false&&this.reportdata.isFranchise===false) {

                await this.evaluateCompetitors(this.reportdata.productType,this.reportdata.targetLocation);
                if (Gpt.flagged) {
                    return await this.flagReport(report, t1);
                }    
                
                if (this.reportdata.competitors.length>0) {

                    let clarity = await this.evaluateClarity(this.reportdata.productType);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }
                    if (clarity.score<=2) {
                        this.reportdata.evaluee.clarity=clarity.explanation!==null?clarity.explanation.replaceAll('"','&apos;'):null;
                        this.reportdata.evaluee.stoplight=this.stoplight(2,clarity.stoplight);    
                    }

                    let productLegality = await this.evaluateLegality("sell "+this.reportdata.productType+" in "+this.reportdata.targetLocation);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }
                    if (productLegality.answer=='no') {
                        this.reportdata.evaluee.legality=productLegality.explanation!==null?productLegality.explanation.replaceAll('"','&apos;'):null;
                        this.reportdata.evaluee.stoplight=this.stoplight(1,productLegality.stoplight);                       
                    }

                    let fields = await ReportFields.findAll({
                        where: {
                            ReportID: reportId
                        }
                    }) 
        
   
                    for (const field of fields) {
                    
                        await this.evaluateFields(field);
                        if (Gpt.flagged) {
                            return await this.flagReport(report, t1);
                        } 
                    }
                    
                    await this.evaluateFinance(report.Money,this.reportdata.productType);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    await this.evaluateGrowth();
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    await this.evaluateRegulatoryRisk();
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    this.reportdata.requirements = await this.requirements("provider of "+this.reportdata.productType);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    this.reportdata.registerbusiness = await this.registerBusiness("provider of "+this.reportdata.productType);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    this.reportdata.tipstricks = await this.tipsTricks("provider of "+this.reportdata.productType);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }
                }
            }
            else {

                let evaluateString=this.reportdata.bizType;
                if (this.reportdata.isPlatform) {
                    evaluateString=this.reportdata.productType+" Platform "+evaluateString;
                }
                if (this.reportdata.isFranchise) {
                    evaluateString=this.reportdata.productType+" Franchise "+evaluateString;
                }

                // Both
                this.reportdata.requirements = await this.requirements(evaluateString);
                if (Gpt.flagged) {
                    return await this.flagReport(report, t1);
                }

                await this.evaluateFinance(report.Money, evaluateString);
                if (Gpt.flagged) {
                    return await this.flagReport(report, t1);
                }
             
                // Platform
                if (this.reportdata.isPlatform) {
                    this.reportdata.registerbusiness = await this.registerBusiness(evaluateString);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    this.reportdata.tipstricks = await this.tipsTricks(evaluateString);
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                }
            }

            await Page.createPublicPage(report.ProductType+" business in "+report.TargetLocation, Page.generatePublicPageURL(report.ProductType, report.ReportID),  JSON.stringify(this.reportdata));

            report.IsProcessing=false;
            report.IsReady=true;

             await report.save({transaction: t1});
             await t1.commit();

        } catch (error) {
            console.log(error);
            await emailtools.failMail('Process Report Error:'+ error.message);
            return [];
        }

    },
    stoplight: function(newv,oldv) {
        if (newv<oldv) {
            return newv;
        }
        return oldv;
    }
}