import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'
import ReportField from '~/models/reportfield';
import Page from '~/utilities/page.js'
import s3 from '~/utilities/s3';

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'POST') {
            let session = await sessiontools.verifySession(event);
            if (session!==null) {   

                let requestData = await readBody(event);

                const result = await Report.findOne({
                    where: {
                        ReportID: requestData.reportId,
                        UserID: session.UserID
                    },
                });
            
                if (result!==null) {

                    await ReportField.destroy({
                        where: {
                            ReportID: requestData.reportId
                        }
                    });

                    s3.deleteS3Object("vetmyideareports",Page.generatePublicPageURL(result.ProductType, result.ReportID),emailtools);

                    result.destroy();
    
                    return { success: true, message: `Report has been successfully deleted.` };
                }
            }
            else {

            }
        }
    } catch (error) {

      await emailtools.failMail(error.message);

      return { success: false, message: "An error occurred, our team has been notified" };
    }
  });