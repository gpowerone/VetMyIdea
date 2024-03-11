import AWS from 'aws-sdk'

// Create SES instance
const ses = new AWS.SES({
    region: 'us-east-2',
    credentials: {
        accessKeyId: typeof(process.env.NUXT_AWS_CLIENT)!=="undefined"?process.env.NUXT_AWS_CLIENT:useRuntimeConfig().awsClient,
        secretAccessKey: typeof(process.env.NUXT_AWS_SECRET)!=="undefined"?process.env.NUXT_AWS_SECRET:useRuntimeConfig().awsSecret
    }
});

export default {
  failMail: async function(msg) {
     await this.sendEmail("admin@vetmyidea.biz", "Fail Mail", msg);
  },
  sendEmail: async function(to, subject, body)  {

     const params = {
         Source: 'admin@vetmyidea.biz',
         Destination: {
             ToAddresses: [to] 
         },
         Message: {
             Subject: {
                 Data: subject 
             },
             Body: {
                 Html: {
                     Data: body 
                 }
             }
         }
     };
 
     ses.sendEmail(params, (err, data) => {
         if (err) {
             console.error('Email send failed:', err);
         } 
     });
  
    }
}
 