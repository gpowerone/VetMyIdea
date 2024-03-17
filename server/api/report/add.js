import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'
import ReportField from '~/models/reportfield.js'
import reportutility from '~/utilities/report.js'
import { v4 as uuidv4 } from 'uuid';

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

                let data = reportutility.verifyReportInput(requestData);
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
                        Novel: false,
                        TargetLocation: data.TargetLocation,
                        IsPublic: requestData.publicReport,
                        ShowEmail: requestData.includeEmail,
                        IsReady: false
                    });

                    for (item of data.FillFields) {
                        await ReportField.create({
                            ReportFieldID: uuidv4(),
                            ReportID: report_id,
                            FieldType: item.FieldType,
                            FieldValue: item.FieldValue
                        })
                    }

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
