import emailtools from './email.js'
import Reports from '../models/report.js' 
import ReportFields from '../models/reportfield.js'
import User from '../models/user.js'
import Gpt from '../utilities/openai.js'
import Page from '../utilities/page.js'
import sequelize from '../models/index.js'

export default {

    productType: "",
    targetLocation: "",
    score: 50,
    reportText: "",
    competitorsNum: 0,
    hadUniqueFeature: false,

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

    evaluateCompetitors: async function() {
        let results = await Gpt.chatGPT("You are an expert on '"+this.productType+"' in "+this.targetLocation + " including national or regional businesses that sell or offer '"+this.productType+"'. "+
        "You only return an array as an answer. "+
        "You do not return an array with more than 10 entries. If there are more than 10 entries, you pick the 10 largest ones to the best of your knowledge. ",
        ["What are all the businesses you know of that sell or offer '"+this.productType+"' in "+this.targetLocation+", including national or regional chains that sell or offer '"+ this.productType+"'. "+
        "Do not include big-box retailers or auction sites that might sell competitor products. Be as exhaustive as possible. Return your answer as an array of [\"companyname\"], or an empty array if there are none"],"gpt-4-turbo-preview");

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
            "You write as if you are providing direct consultation on a business idea. " +
            "You do not use metaphors or similes. "+
            "You don't refer to any part of the prompt in written explanations. "+
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
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
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

    evaluateField: async function(demarcator,targetStatement,conjunction,benefitStatement,possibilityStatement,efficacyStatement,evalUniqueness,field) {
    
        try {

            this.reportText+='"'+demarcator+'": {'

            let possibility = await this.evaluatePossibility(possibilityStatement);
            if (possibility.answer=='no') {

                let ridiciulousness = await this.evaluateRidiculousness(field.FieldValue);
                if (ridiciulousness.score<8) {

                
                    let legality = await this.evaluateLegality(targetStatement+" "+this.productType+" in "+this.targetLocation+" "+conjunction+" '"+field.FieldValue+"'");
                    if (legality.answer=='no') {    
                
                        let score=0; 

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
                            explanation+=benefits.explanation;

                            if (benefits.answer>=9) {
                                score+=30;
                            }
                            else if (benefits.answer==7) {
                                score+=10;                     
                            }
                
                            let evaluateRisk=true;
                            if (score>0) {
                                let specificity = await this.evaluateSpecificity("'"+field.FieldValue+"'",efficacyStatement);
                                if (specificity.score<=3) {
                                    evaluateRisk=false;
                                    explanation+="<br /><br /><em>Specificity</em><br />The statement '"+field.FieldValue+"' is not specific enough to earn points for this category. To fairly evaluate your strategy, you will need to be more specific. Describe exactly <em>how</em> you plan to do what you are going to do.";
                                    score=0;
                                }
                                else {    
                                    this.hadUniqueFeature=true;                            
                                }
                            }

                            if (evaluateRisk) {
                                let risk = await this.evaluateRisk(targetStatement+" "+this.productType+" in "+this.targetLocation+" "+conjunction+" '"+field.FieldValue+"'")

                                let risk_total = -1*risk.answer*10;
                                if (risk_total<-30) {
                                    risk_total=-30;
                                }

                                score+=risk_total;

                                if (risk_total<0 && risk.explanation!==null) {
                                    explanation+="<br /><br /><em>Potential Risks</em><br />"+risk.explanation;   
                                }
                            }
            
                        }
                        else {
                            if (uniqueness.answer=='yes') {
                                if (evalUniqueness) {
                                    explanation+="<em>Uniqueness</em><br />This feature may not be unique among features for this product<br /><br />"+uniqueness.explanation;
                                }
                                else {
                                    explanation+="<em>Drawback</em><br />One or more drawbacks to this strategy may exist<br /><br />"+uniqueness.explanation;
                                }
                            }
                        }

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
                    this.reportText+='"viable":{"evaluatedString":"'+field.FieldValue+'","explanation":"'+ridiciulousness.explanation+'"}},';
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
                "You are a lawyer with great knowledge of "+this.productType+". You practice in "+this.targetLocation + ". "+
                "You provide answers with respect to legal facts only. " + 
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
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
                "You are an expert on "+this.productType+" in "+this.targetLocation + ". "+
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
                "You are a risk analyst with great knowledge of "+this.productType+". You work in "+this.targetLocation + ". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You do not refer to yourself. "+
                "You only give integer scores. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You don't give scores of 7. If you would give a 7, you must analyze further to determine if it is more of a 8 or a 6. ",
                ["Evaluate '"+evaluateString+"' for the following risks. A score of 1 means 'totally harmless', a score of 10 means 'the risk will certainly cause a business selling "+this.productType+" to fail' "+
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
                "You are an expert on "+this.productType+" in "+this.targetLocation+". "+
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
                "You are an expert on "+this.productType+" in "+this.targetLocation+". "+
                "You provide answers with respect to objective data only. "+
                "You write as if you are providing direct consultation on a business idea. " +
                "You do not use metaphors or similes. "+
                "You don't refer to any part of the prompt in written explanations. "+
                "You do not refer to yourself. "+
                "You don't refer to percentages in your explanations. ",
                ["Does "+evaluateString+" appear in more than 50% of "+this.productType+" on the market currently? Give your answer as an object: "+
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
               "You are an expert on "+this.productType+" in "+this.targetLocation+". "+
               "You provide answers with respect to objective data only. "+
               "You write as if you are providing direct consultation on a business idea. " +
               "You do not use metaphors or similes. "+
               "You don't refer to any part of the prompt in written explanations. "+
               "You do not refer to yourself. "+
               "You only give negative explanations. ",
               ["Does "+evaluateString+" make "+this.productType+" less competitive on the market in "+this.targetLocation+"? Give your answer as an object: "+
               "{ \"answer\":\"yes|no\", \"explanation\":\"explanation if answer==yes\" }"],"gpt-4-turbo-preview");

           return JSON.parse(result[0].trim());
        }
        catch(e) {
           console.log(e);
           return null;
        }
   },

   evaluateSpecificity: async function(evaluateString,action) {
        try {
           let result = await Gpt.chatGPT(
               "You are an omniscient god. " +
               "You do not give scores of 4. If you would give a score of 4, you analyze further and give a 3 or 5 instead ",
               ["How does '"+evaluateString+"' about '"+action+"' of '"+this.productType+"' score on a scale of 'explicitness about what it is or what is being done' from 1 to 10, "+
               "where 1 is equivalent to 'I'll do it' and 10 is equivalent to 'I'll rework every homework problem until I get an A'. "+
               "Give your answer as an object: {\"score\":\"1 to 10\"}"],"gpt-4-turbo-preview");

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
                "appeal to users of "+this.productType+" in "+this.targetLocation+"? Base your answer off of how much many users will want to use the feature based upon your knowledge of how popular the feature is. ",
                "the following feature for "+this.productType+" - "+field.FieldValue,
                null,
                true,
                field);
        }
        if (field.FieldType == "Cost") {
            return await this.evaluateField(
                "cost",
                "reduce costs",
                "by",
                "reduce costs for "+this.productType+" in "+this.targetLocation,
                "following method to reduce costs for "+this.productType+" - "+field.FieldValue,
                "reducing costs of",
                false,
                field);
        }
        if (field.FieldType == "Marketing") {
            return await this.evaluateField(
                "marketing",
                "market",
                "by",
                "market "+this.productType+" in "+this.targetLocation,
                "following method to market "+this.productType+" - "+field.FieldValue,
                "marketing",
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

            this.productType=report.ProductType;
            this.targetLocation=report.TargetLocation;
          
            this.reportText='{';

            if (await this.evaluateCompetitors()) {

                let viability=false;

                let clarity = await this.evaluateClarity(this.productType);
                if (clarity.score>2) {

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
                                    return await this.flagReport(report, t1);
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
                }
                else {
                    this.reportText+='"viable":"no", "explanation":"'+clarity.explanation+"', ";
                }

                if (viability) {
                    this.reportText+='"viable":"yes", ';
                    report.IsViable=true;

                    if (this.competitorsNum>3 && !this.hadUniqueFeature) {
                        this.score-=30;
                    }

                    await this.evaluateGrowth();
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
                    }

                    await this.evaluateRegulatoryRisk();
                    if (Gpt.flagged) {
                        return await this.flagReport(report, t1);
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
                    return await this.flagReport(report, t1);
                }    
                this.reportText+='"novel":"true", "created":'+Date.now()+'}';
            }

           await Page.createPublicPage(report.ProductType+" business in "+report.TargetLocation, Page.generatePublicPageURL(report.ProductType, report.ReportID),  this.reportText);

           report.IsProcessing=false;
           report.IsReady=true;

           await report.save({transaction: t1});
           await t1.commit();

        } catch (error) {
            console.log(error);
            await emailtools.failMail('Process Report Error:'+ error.message);
            return [];
        }

    }
}