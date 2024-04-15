import { defineEventHandler, readBody, setCookie } from 'h3';
import sessiontools from '~/utilities/sessiontools.js';

export default defineEventHandler(async (event) => {
    try {
        const { code,typ } = await readBody(event);

        let redirectUri="https://vetmyidea.biz/";
        if (typ=="d") {
            redirectUri="https://vetmyidea.biz/dashboard";
        }
      
        // Requesting LinkedIn access token using the code
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: useRuntimeConfig().public.linkedinClient,
                client_secret: useRuntimeConfig().linkedinSecret
            })
        });

        if (!tokenResponse.ok) throw new Error('Failed to fetch access token');

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetching user profile with the access token
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!profileResponse.ok) throw new Error('Failed to fetch LinkedIn profile');

        const profile = await profileResponse.json();

        let session = await sessiontools.createSession(profile.sub, 'linkedin', profile.given_name);

        setCookie(event, "vms", session.Token);

        return { success: true, data: session.UserFirstName, isAdmin: session.isAdmin, id: session.id };

    } catch (error) {
        console.error(error);
        return { success: false };
    }
});
