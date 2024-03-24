import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  region: 'us-east-2',
  credentials: {
      accessKeyId: typeof(process.env.NUXT_AWS_CLIENT)!=="undefined"?process.env.NUXT_AWS_CLIENT:useRuntimeConfig().awsClient,
      secretAccessKey: typeof(process.env.NUXT_AWS_SECRET)!=="undefined"?process.env.NUXT_AWS_SECRET:useRuntimeConfig().awsSecret
  }
});
const cloudfront = new AWS.CloudFront();

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
      else {
        invalidateCloudFront("/"+destinationKey, Eml);
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
  invalidateCloudFront: function(urlPath, Eml) {
    const params = {
        DistributionId: "E3VCSBMDD6EWTE", // The ID of your CloudFront distribution
        InvalidationBatch: { 
            CallerReference: 'invalidate-' + new Date().toISOString(), // Unique identifier for the request
            Paths: { 
                Quantity: 1, // The number of paths that you want to invalidate
                Items: [urlPath] // The path of the URL to invalidate
            }
        }
    };

    cloudfront.createInvalidation(params, function(err, data) {
        if (err) {
            Eml.failMail("Error creating CloudFront invalidation: "+ err);
        } 
    });
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
      else {
        invalidateCloudFront("/"+destinationKey, Eml);
      } 
    });
  }
}
