import AWS from 'aws-sdk';

const cloudfront = new AWS.CloudFront({
    region: 'us-east-2',
    credentials: {
        accessKeyId: typeof(process.env.NUXT_AWS_CLIENT)!=="undefined"?process.env.NUXT_AWS_CLIENT:useRuntimeConfig().awsClient,
        secretAccessKey: typeof(process.env.NUXT_AWS_SECRET)!=="undefined"?process.env.NUXT_AWS_SECRET:useRuntimeConfig().awsSecret
    }
});

export default {
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
    }
}