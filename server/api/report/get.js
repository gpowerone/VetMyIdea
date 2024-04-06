import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'
import ReportField from '~/models/reportfield.js'

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'POST') {
            let session = await sessiontools.verifySession(event);
            if (session!==null) {   

                let requestData = await readBody(event);

                const result = await Report.findOne({
                    where: {
                        ReportID: requestData.reportId,
                        UserID: session.UserID,
                        IsProcessing: false
                    },
                });
            
                if (result!==null) {

                    let reportdata = {
                         ProductType: result.ProductType,
                         TargetLocation: result.TargetLocation,
                         uniqueFeaturesEntry: null,
                         costEntry: null,
                         marketingEntry: null,
                    };

                    const fields = await ReportField.findAll({
                        where: {
                            ReportID: requestData.reportId
                        }
                    });

                    fields.forEach((field)=>{
                         if (field.FieldType=="Unique Feature") {
                            reportdata.uniqueFeaturesEntry = field.FieldValue;
                         }
                         if (field.FieldType=="Cost") {
                            reportdata.costEntry = field.FieldValue;
                         }
                         if (field.FieldType=="Marketing") {
                            reportdata.marketingEntry = field.FieldValue;
                         }
              
                    })

    
                    return { success: true, data: reportdata };
                }
                else {
                    return { success: false, message: "Could not get report" };
                }
            }
            else {
                return { success: false, message: "Invalid session" };
            }
        }
    } catch (error) {

      await emailtools.failMail(error.message);

      return { success: false, message: "An error occurred, our team has been notified" };
    }
  });