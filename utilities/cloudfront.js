import AWS from 'aws-sdk';

const cloudfront = new AWS.CloudFront();

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