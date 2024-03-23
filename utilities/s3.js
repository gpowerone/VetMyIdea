import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  region: 'us-east-2',
  credentials: {
      accessKeyId: typeof(process.env.NUXT_AWS_CLIENT)!=="undefined"?process.env.NUXT_AWS_CLIENT:useRuntimeConfig().awsClient,
      secretAccessKey: typeof(process.env.NUXT_AWS_SECRET)!=="undefined"?process.env.NUXT_AWS_SECRET:useRuntimeConfig().awsSecret
  }
});

export default {
  copyS3Object: async function(bucketName, sourceKey, destinationKey, Eml) {
    const copyParams = {
      Bucket: bucketName,
      CopySource: encodeURIComponent(bucketName + '/' + sourceKey),
      Key: destinationKey
    };
  
    S3.copyObject(copyParams, function(err, data) {
      if (err) {
        Eml.failMail('AWS S3 - An error occurred:'+ err)
      } 
    });
  },
  deleteS3Object: async function(bucketName, destinationKey, Eml) {
    const deleteObjectParams = {
       Bucket: bucketName,
       Key: destinationKey
    };
    
    S3.deleteObject(deleteObjectParams, function(err, data) {
      if (err) {
        Eml.failMail('AWS S3 - An error occurred:'+ err)
      } 
    });
  },
  getS3Object: async function(bucketName, keyName, Eml) {
    try {

      // Start streaming the file from S3, decompress and process it
      return S3.getObject({ Bucket: bucketName, Key: keyName }).promise().then(data => { 
          return data.Body.toString();  
      })
      .catch(err=>{
          Eml.failMail('AWS S3 - An error occurred:'+ err);
      })
        
    } catch (err) {
      Eml.failMail('AWS S3 - An error occurred:'+ err.message)
      return "";
    } 
  },
  writeS3Object: async function(bucketName, keyName, body, contentType, Eml) {
    const params = {
      Bucket: bucketName,
      Key: keyName,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read'
    };
  
    S3.putObject(params, function(err, data) {
      if (err) {
        Eml.failMail('AWS S3 - An error occurred:'+ err)
      } 
    });
  }
}
