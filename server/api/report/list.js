import sessiontools from '~/utilities/sessiontools.js'
import Report from '~/models/report.js'
import emailtools from '~/utilities/email.js' 
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {

    try {
  
        let session = await sessiontools.verifySession(event);
        if (session) {   

            const query = getQuery(event);
   
            const ds = await Report.findAll({
                where: { UserID: session.UserID },
            });

            return { success: true, data: ds }
        
        } 
       
    } catch (error) {
        await emailtools.failMail(error.message)
    }

    return { success: false }
});