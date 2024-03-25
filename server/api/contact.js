import fetch from 'node-fetch';
import mail from '~/utilities/email.js'

export default defineEventHandler(async (event) => {
  try {
    const { email, message, token } = await readBody(event);

    const result = await fetch("https://www.google.com/recaptcha/api/siteverify", 
      { 
          method: "POST", 
          body: "&secret="+useRuntimeConfig().recaptchaSecret+"&response="+token,
          headers: {
             "Content-Type": "application/x-www-form-urlencoded"
          } 
      }
    );
    const result_json = await result.json();

    if (!result_json.success) {
       return { success: true, message: "CAPTCHA verification failed", data: {}};
    }

    if (!email) {
      return { success: true, message: 'Email is required', data: {} };
    }

    await mail.sendEmail("admin@vetmyidea.biz","Vet My Idea contact form","Email: "+email+"<br />Message:<br />"+message);

    return { success: true, message: 'OK', data: {} };
  } catch (error) {

    return { success: false, message: error.message, data: {} };

  }
});
