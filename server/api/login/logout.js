import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import Session from '~/models/session.js';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'POST') {
            let sess = await sessiontools.verifySession(event);
            if (sess!==null) {   
                const sessiondata = await Session.findOne({
                    where: {
                        SessionID: sess.SessionID
                    }
                })
                if (sessiondata!==null) {
                    await sessiondata.destroy();
                }
                setCookie(event, "vms", "");

                return { success: true }
            }
            
        }
    } catch (error) {
        await emailtools.failMail(error.message)
    }

    return { success: false }
});
    
