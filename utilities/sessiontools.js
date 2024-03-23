import emailtools from './email.js'
import Session from '../models/session.js';
import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';
import tools from '../utilities/general.js'
import { getCookie } from 'h3'

export default {
    createSession: async function(username,authsource,given_name) {

        let user = await User.findOne({
            where: {
                Username: username,
                AuthSource: authsource
            }
        })

        if (user===null) {
            user = await User.create({
                    UserID: uuidv4(),
                    Username: username,
                    IsAdmin: false,
                    AuthSource: authsource,
                    Remaining: 3,
                    IsAdmin: false,
                    IsUnlimited: false,
                    ProjectCredits: 0
                })
        }

        let session = await Session.findOne({
            where: {
                UserID: user.UserID
            }
        })
        if (session===null) {
            session = await Session.create({
                SessionID: uuidv4(),
                Token: tools.generaterandomstring(225),
                UserID: user.UserID,
                UserFirstName: given_name
            })
        }

        return { 
            Token: session.Token,
            UserFirstName: session.UserFirstName,
            isAdmin: user.IsAdmin
        }; 
    },
    verifySession: async function(event) {
        try {
            // Extract the 'vms' cookie
            let cookie = getCookie(event, 'vms');
            if (cookie) {
                // Query the session table for the token
                const session = await Session.findOne({
                    where: {
                        Token: cookie
                    }
                })
            
                if (session) {           
                    // Session is valid
                    let user = await User.findOne({
                        where: {
                            UserID: session.UserID
                        }
                    })
                    if (user) {
                        return { 
                            UserFirstName: session.UserFirstName,
                            UserID: session.UserID,
                            SessionID: session.SessionID
                        }; 
                    }
                }               
            }      
        } catch (error) {
            // Handle any errors that occur during the process
            await emailtools.failMail(error.message);
        }

        return null
    }
}