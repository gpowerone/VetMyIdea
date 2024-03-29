import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Report from '~/models/report.js'

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'POST') {
            let session = await sessiontools.verifySession(event);
            if (session!==null) {   

                let requestData = await readBody(event);

                const report = await Report.findOne({
                    where: {
                        ReportID: requestData.reportId,
                        UserID: session.UserID,
                        IsProcessing: false,
                        IsReady: true
                    },
                });

                if (report!==null) {
                    return { success: true };
                }
                else {
                    return { success: false };
                }

            }
        }
    } catch(error) {
        await emailtools.failMail(error.message);
    }
})