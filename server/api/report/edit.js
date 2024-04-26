import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'
import ReportField from '~/models/reportfield.js'
import tools from '~/utilities/general.js'
import { v4 as uuidv4 } from 'uuid';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

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


                const report = await Report.findOne({
                    where: {
                        ReportID: requestData.reportId,
                        UserID: session.UserID,
                        IsProcessing: false,
                        [Op.or]: [
                            {IsReady: true},
                            {Flagged: true}
                        ]
                    },
                });
            
                if (report!==null) {
    
                    let data = tools.verifyReportEdit({
                        IsValid: true,
                        FillFields: [],
                    },requestData);
                    if (data.IsValid) {

                        await ReportField.destroy({
                             where: {
                                ReportID: requestData.reportId
                             }
                        })

                        data.FillFields.forEach(async (item)=>{
                            await ReportField.create({
                                ReportFieldID: uuidv4(),
                                ReportID: requestData.reportId,
                                FieldType: item.FieldType,
                                FieldValue: item.FieldValue
                            })
                        })

                        report.IsReady=false;
                        report.Flagged=false;
                        await report.save();

                        return { success: true };
                    }
                    else {
                        return { success: false, message: data.Error };
                    }
                }
                else {
                    return { success: false, message: "Report not found" }        
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
