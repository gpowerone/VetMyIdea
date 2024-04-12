import {OAuth2Client} from 'google-auth-library'
import { setCookie } from 'h3';
import sessiontools from '~/utilities/sessiontools.js'

export default defineEventHandler(async (event) => {
    try {
        const { credential } = await readBody(event);

        const oAuth2Client = new OAuth2Client(
            useRuntimeConfig().public.googleClient,
            useRuntimeConfig().googleSecret,
            ["https://vetmyidea.biz","https://www.vetmyidea.biz","http://localhost:3000"]
          );

        const r = await oAuth2Client.verifyIdToken({ idToken: credential, audience: useRuntimeConfig().public.googleClient });
        const payload = r.getPayload();

        let session = await sessiontools.createSession(payload['sub'],'google', payload['given_name']);

        setCookie(event, "vms", session.Token);

        return { success: true, data: session.UserFirstName, isAdmin: session.isAdmin, id: session.id }

    } catch (error) {
        return { success: false }
    }
  });
  