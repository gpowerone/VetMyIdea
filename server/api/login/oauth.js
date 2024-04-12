import { setCookie } from 'h3';
import sessiontools from '~/utilities/sessiontools.js'

export default defineEventHandler(async (event) => {
    try {
        const { code,typ } = await readBody(event);

        let redirecturi="https://vetmyidea.biz/wizard";
        if (typ=="d") {
            redirecturi="https://vetmyidea.biz/dashboard";
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirecturi,
            client_id: useRuntimeConfig().public.oauthClient,
            client_secret: useRuntimeConfig().oauthSecret,
        });

        // Contact the IdP to exchange the code for an access token
        const response = await fetch(useRuntimeConfig().oauthToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!response.ok) {
            return { success: false };
        }

        const json = await response.json();

        const userinfo = await fetch(useRuntimeConfig().oauthUserinfo, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${json.access_token}`
            } 
        });

        if (!userinfo.ok) {
            return { success: false };
        }

        const user = await userinfo.json();
        let name=""; 
        if (user.given_name) {
            name=user.given_name;
        }
        else {
            name=user.name;
        }

        let session = await sessiontools.createSession(user.sub,'oauth', name);

        setCookie(event, "vms", session.Token);

        return { success: true, data: session.UserFirstName, isAdmin: session.isAdmin, id: session.id }
    } catch (error) {
        console.log(error);
        return { success: false }
    }
  });
  