import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'
import ReportField from '~/models/reportfield.js'
import { v4 as uuidv4 } from 'uuid';

function verifyReportInput(requestData) {
    let data = {
        IsValid: false,
        FillFields: []
    }

    if (requestData.product && requestData.product.length>0) {
        data.ProductType = requestData.product.replace(/[^\x00-\x7F]/g, "").trim();
        if (data.ProductType.length<=100 && /^[A-Za-z0-9\.\'\s]+$/.test(data.ProductType)) {
            if (requestData.targetedLocation && requestData.targetedLocation.length>0 && requestData.targetedLocation.length<200 && /^[A-Za-z0-9\,\s]+$/.test(requestData.targetedLocation)) {
                data.TargetLocation=requestData.targetedLocation.replace(/[^\x00-\x7F]/g, ""); 
                data.IsValid=true;

                if (requestData.rawMaterialsEntry && requestData.rawMaterialsEntry.length>0 && requestData.rawMaterialsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.rawMaterialsEntry)) {
                    data.FillFields.push({"FieldType": "Reduced Raw Materials Cost", "FieldValue": requestData.rawMaterialsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                }

                if (requestData.laborCostsEntry && requestData.laborCostsEntry.length>0 && requestData.laborCostsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.laborCostsEntry)) {
                    data.FillFields.push({"FieldType": "Reduced Labor Cost", "FieldValue": requestData.laborCostsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                }

                if (requestData.shippingCostsEntry && requestData.shippingCostsEntry.length>0 && requestData.shippingCostsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.shippingCostsEntry)) {
                    data.FillFields.push({"FieldType": "Reduced Shipping Cost", "FieldValue": requestData.shippingCostsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                }

                if (requestData.uniqueFeaturesEntry && requestData.uniqueFeaturesEntry.length>0 && requestData.uniqueFeaturesEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.uniqueFeaturesEntry)) {
                    data.FillFields.push({"FieldType": "Unique Feature", "FieldValue": requestData.uniqueFeaturesEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                }

            }
        }
    }

    return data;
}

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'POST') {
            let session = await sessiontools.verifySession(event);
            if (session!==null) {   

                let requestData = await readBody(event);

                const result = await fetch("https://www.google.com/recaptcha/api/siteverify", 
                { 
                    method: "POST", 
                    body: "&secret="+useRuntimeConfig().recaptchaSecret+"&response="+requestData.token,
                    headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                    } 
                });
                
                const result_json = await result.json();
            
                if (!result_json.success) {
                    return { success: true, message: "CAPTCHA verification failed", data: {}};
                }    

                let data = verifyReportInput(requestData);
                if (data.IsValid) {

                    // Uppercase first letter of product type name
                    data.ProductType=data.ProductType[0].toUpperCase()+data.ProductType.slice(1);

                    let report_id = uuidv4();
                    await Report.create({
                        ReportID: report_id,
                        UserID: session.UserID,
                        ProductType: data.ProductType,
                        Score: null,
                        Flagged: false,
                        TargetLocation: data.TargetLocation,
                        IsProcessing: false,
                        ProductURL: null,
                        IsDebug: true,
                        Processor: 1,
                        IsReady: false
                    });

                    data.FillFields.forEach(async (item)=>{
                        await ReportField.create({
                            ReportFieldID: uuidv4(),
                            ReportID: report_id,
                            FieldType: item.FieldType,
                            FieldValue: item.FieldValue
                        })
                    })

                    return { success: true };
                }
                else {
                    return { success: false, message: data.Error };
                }
                
        
            }
            return { success: false, message: "Invalid Session" }
            
        }
    } catch (error) {
        await emailtools.failMail(error.message);
        return { success: false, message: "An error occurred, our team has been notified" };
    }

    return { success: false, message: "Invalid Request Method" }
});
