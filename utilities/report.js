import emailtools from './email.js'
import Reports from '../models/report.js' 
import ReportFields from '../models/reportfield.js'
import Gpt from '../utilities/openai.js'
import s3 from './s3.js'

export default {

    productType: "",
    targetLocation: "",
    score: 50,
    reportText: "",

    evaluateCompetitors: async function() {
        let results = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional businesses that sell or offer "+this.productType+". You do not reference yourself in your answer.",
        ["What are all the businesses you know of that sell or offer "+this.productType+" in "+this.targetLocation+", including national or regional chains that sell or offer "+ this.productType+". "+
        "Return your answer as an array of [&quot;companyname&quot;], or an empty array if there are none"]);

        try {
            let parsedResults = JSON.parse(results[0]);
            if (parsedResults.length>0) { 
                this.reportText+='"competitors": '+results[0]+',';
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
            let growth = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
            ["What is the outlook for growth for "+this.productType+" in "+this.targetLocation+" for the next 5 years? Give your answer as an object: {&quot;growth&quot;:&quot;very good|good|fair|poor|very poor&quot;, &quot;explanation&quot;:&quot;explanation&quot;}"]);
        
            let parsed=JSON.parse(growth[0]);

            parsed.score=0;
            if (parsed.growth.trim().toLowerCase()=='very good') {
                parsed.score=25;
            }
            else if (parsed.growth.trim().toLowerCase()=='good') {
                parsed.score=15;
            }
            else if (parsed.growth.trim().toLowerCase()=='poor') {
                parsed.score=-15;
            }
            else if (parsed.growth.trim().toLowerCase()=='very poor') {
                parsed.score=-25;
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
            let risk = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
            ["What is the risk that the sale of "+this.productType+" in "+this.targetLocation+" will be legally regulated such that a company selling "+this.productType+" would be negatively impacted?"+ 
            "Give your answer as an object: { &quot;risk&quot;: &quot;low|medium|high&quot;, &quot;explanation&quot;: &quot;explanation&quot; }"]);

            let parsed=JSON.parse(risk[0]);

            parsed.score=0;
            if (parsed.risk.trim().toLowerCase()=='medium') {
                parsed.score=-10;
            }
            if (parsed.risk.trim().toLowerCase()=='high') {
                parsed.score=-25;
            }

            this.score+=parsed.score;
            this.reportText+='"regulatoryRisk": '+JSON.stringify(parsed)+',';
        }
        catch(e) {
            console.log(e);
            return false;
        }

    },
    evaluateUniqueFeature: async function(field) {

        // viability test
        try {
            let unique_feature_viability = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
            ["If someone told you that they were selling "+this.productType+" with feature '"+field.FieldValue+"', would you believe this is a viable feature. Give 'yes', 'no', or 'incomprehensible' only as an answer"])[0];
            
            if (unique_feature_viability.trim().toLowerCase()=='yes') {
                    
                this.reportText+='"uniqueFeature": {'

                let unique_feature_risk  = JSON.parse(await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.", 
                ["Does adding the feature '"+field.FieldValue+"' to selling "+this.productType+" in "+this.targetLocation +" create a risk that the business doing so would suffer reputation loss, legal penalties, or be forced to close? "+
                "Give your answer as an object: { &quot;answer&quot;: &quot;yes|no&quot;, &quot;explanation&quot;: &quot;explanation&quot; }"])[0]);

                let score=0; 
                if (unique_feature_risk.answer.trim().toLowerCase()=='yes') {
                    score-=25;
                    this.reportText+='"risk": "'+unique_feature_risk.explanation+'",';
                }

                let unique_feature_benefits =  JSON.parse(await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
                ["Given your knowledge of "+this.productType+" in "+this.targetLocation +"? How does "+field.FieldValue+" align with what customers want in "+this.productType+
                " Give your answer as an object: { align: &quot;strongly|minor|not at all&quot;, explanation: &quot;explanation&quot; }"])[0]);
                if (unique_feature_benefits.align.trim().toLowerCase()=='strongly') {
                    score+=20;
                }
                else if (unique_feature_benefits.align.trim().toLowerCase()=='minor') {
                    score+=10;
                }
                else {
                    score-=15;
                }

                this.reportText+='"benefits":"'+unique_feature_benefits.explanation+'",';

                this.score+=score;
                this.reportText+='"score":'+score+',"viable":"yes"},';
            }
            else {
                this.reportText+='"uniqueFeature": {viable:"no"},'
            }  
        }
        catch(e) {
            return false;
        }

    },
    evaluateRawMaterials: async function(field) {
    
        // viability test
        try {
            let raw_materials_viability = await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.", 
            ["If someone told you that they could reduce the cost of materials to make or provide "+this.productType+" by '"+field.FieldValue+"', do you believe this is a comprehensible, sensical idea? Give 'yes', 'no', or 'incomprehensible' only as an answer"])[0];
        
            if (raw_materials_viability.trim().toLowerCase()=='yes') {

                this.reportText+='"rawMaterialsCost": {'

                let raw_materials_risk = JSON.parse(await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
                ["Does reducing the cost of materials to make or provide "+this.productType+" by '"+field.FieldValue+"' create a risk that the business doing so would suffer reputation loss, legal penalties, or be forced to close? "+
                "Give your answer as an object: { answer: &quot;yes|no&quot;, explanation: &quot;explanation&quot; }"])[0]); 
                
                let score=0; 
                if (raw_materials_risk.answer.trim().toLowerCase()=='yes') {
                    score=-25;
                    this.reportText+='risk: "'+raw_materials_risk.explanation+'"';
                } 

                let raw_materials_benefits =  JSON.parse(await Gpt.chatGPT("You are an expert on "+this.productType+" in "+this.targetLocation + " including national or regional business that sell or offer "+this.productType+". You do not reference yourself in your answer.",
                ["Given your knowledge of "+this.productType+" in "+this.targetLocation +"? How well could '"+field.FieldValue+"' reduce the cost of making or providing "+this.productType+
                " Give your answer as an object: { align: &quot;strongly|minor|not at all&quot;, explanation: &quot;explanation&quot; }"])[0]);
                if (raw_materials_benefits.align.trim().toLowerCase()=='strongly') {
                    score+=20;
                }
                if (raw_materials_benefits.align.trim().toLowerCase()=='minor') {
                    score+=10;
                }
                this.reportText+='benefits:"'+raw_materials_benefits.explanation+'",';
                
                this.score+=score;
                this.reportText+='score:'+score+',viable:"yes"},';
            }
            else {
                this.reportText+='rawMaterials: {viable:"no"}'
            } 
        }
        catch(e) {
            return false;
        }
    

    },
    evaluateRisksRewards: async function(field) {

        if (field.FieldType == "Unique Feature") {
           await this.evaluateUniqueFeature(field);
        }
        if (field.FieldType == "Reduced Raw Materials Cost") {
           await this.evaluateRawMaterials(field);
        }

    },
    flagReport: async function(report) {
        report.Flagged=true;
        await report.save();
    },
    processReport: async function(reportId) {
        try {
            let report = await Reports.findByPk(reportId);
            if (!report) return null;

            this.productType=report.ProductType;
            this.targetLocation=report.TargetLocation;
          
            if (await this.evaluateCompetitors()) {

                this.reportText='{';

                await this.evaluateGrowth();
                if (Gpt.flagged) {
                    return await flagReport(report);
                 }

                await this.evaluateRegulatoryRisk();
                if (Gpt.flagged) {
                    return await flagReport(report);
                 }

                for (field in await ReportFields.findAll({
                    where: {
                      ReportID: reportId
                    }
                })) {
                    await this.evaluateRisksRewards(report.ProductType, report.TargetLocation, field);
                    if (Gpt.flagged) {
                        return await flagReport(report);
                     }
                }

                //await this.getFeatures();
  
                if (this.score<0) this.score=0;
                if (this.score>100) this.score=100;
                report.Score=this.score;
                
                // summary
                this.reportText+='summary: {'
                this.reportText+='"score":'+report.Score+",";

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
                console.log(this.reportText);

                // Write the JSON to S3
                //s3.writeS3Object("vetmyideareportdata",reportId,this.reportText,"application/json",emailtools);

                // Fill the report template and write that to S3

           }
           else {
              if (Gpt.flagged) {
                 return await flagReport(report);
              }    
              report.Novel=true; 
              report.IsPublic=false;
           }

           report.IsReady=true;

           await report.save();

        } catch (error) {
            await emailtools.failMail('Process Report Error:'+ error.message);
            return [];
        }

    },
    verifyReportInput: function(requestData) {
        let data = {
            IsValid: false,
            FillFields: []
        }

        if (requestData.product && requestData.product.length>0) {
            data.ProductType = requestData.product.trim();
            if (data.ProductType.length<=100 && /^[A-Za-z0-9\.\s]+$/.test(data.ProductType)) {
                if (requestData.targetedLocation && requestData.targetedLocation.length>0 && requestData.targetedLocation.length<200 && /^[A-Za-z0-9\,\s]+$/.test(requestData.targetedLocation)) {
                    data.TargetLocation=requestData.targetedLocation; 
                    data.IsValid=true;

                    if (requestData.rawMaterialsEntry && requestData.rawMaterialsEntry.length>0 && requestData.rawMaterialsEntry.length<=300 && /^[A-Za-z0-9\.\s]+$/.test(requestData.rawMaterialsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Raw Materials Cost", "FieldValue": requestData.rawMaterialsEntry});
                    }

                    if (requestData.laborCostsEntry && requestData.laborCostsEntry.length>0 && requestData.laborCostsEntry.length<=300 && /^[A-Za-z0-9\.\s]+$/.test(requestData.laborCostsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Labor Cost", "FieldValue": requestData.laborCostsEntry});
                    }

                    if (requestData.shippingCostsEntry && requestData.shippingCostsEntry.length>0 && requestData.shippingCostsEntry.length<=300 && /^[A-Za-z0-9\.\s]+$/.test(requestData.shippingCostsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Shipping Cost", "FieldValue": requestData.shippingCostsEntry});
                    }

                    if (requestData.uniqueFeaturesEntry && requestData.uniqueFeaturesEntry.length>0 && requestData.uniqueFeaturesEntry.length<=300 && /^[A-Za-z0-9\.\s]+$/.test(requestData.uniqueFeaturesEntry)) {
                        data.FillFields.push({"FieldType": "Unique Feature", "FieldValue": requestData.uniqueFeaturesEntry});
                    }

                }
            }
        }

        return data;
    }
}