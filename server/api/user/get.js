import sessiontools from '~/utilities/sessiontools.js'
import emailtools from '~/utilities/email.js' 
import User from '~/models/user.js'

export default defineEventHandler(async (event) => {

    try {
        if (event.method === 'GET') {
            let session = await sessiontools.verifySession(event);
            if (session!==null) {   

                let user = await User.findOne({
                    where: {
                        UserID: session.UserID
                    }
                })
                if (user) {
                    return { success: true, message: user.IsUnlimited?"U":user.Remaining };
                }
                else {
                    return { success: false, message: "Invalid user" };
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
