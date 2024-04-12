import crypto from 'crypto'

export default {
    generaterandomstring: function(length) {
      
        const randomBytes = crypto.randomBytes(length);
        let randomString = randomBytes.toString('base64');

        if (randomString.length > length) {
            randomString = randomString.substring(0, length);
        }

        return randomString;
    },
    verifyReportInput: function(requestData) {
        let data = {
            IsValid: false,
            FillFields: []
        }
    
        if (requestData.product && requestData.product.length>0) {
            data.ProductType = requestData.product.trim();
            if (data.ProductType.length>0 && data.ProductType.length<=100) {
                if (requestData.targetedLocation && requestData.targetedLocation.trim().length>0 && requestData.targetedLocation.trim().length<200) {
                    data.TargetLocation=requestData.targetedLocation.trim(); 
                    data.IsValid=true;
    
                    if (requestData.marketingEntry) {
                        if (requestData.marketingEntry.length>0 && requestData.marketingEntry.length<=300) {
                            data.FillFields.push({"FieldType": "Marketing", "FieldValue": requestData.marketingEntry.trim()});
                        }
                        else {
                            return {
                                IsValid: false,
                                FillFields: [],
                                Error: "Marketing entry invalid"
                            }
                        }
                    }
    
                    if (requestData.costsEntry) {
                        if (requestData.costsEntry.length>0 && requestData.costsEntry.length<=300) {
                            data.FillFields.push({"FieldType": "Cost", "FieldValue": requestData.costsEntry.trim()});
                        }
                        else {
                            return {
                                IsValid: false,
                                FillFields: [],
                                Error: "Cost entry invalid"
                            }
                        }
                    }

    
                    if (requestData.uniqueFeaturesEntry) {
                        if (requestData.uniqueFeaturesEntry.length>0 && requestData.uniqueFeaturesEntry.length<=300) {
                            data.FillFields.push({"FieldType": "Unique Feature", "FieldValue": requestData.uniqueFeaturesEntry.trim()});
                        }
                        else {
                            return {
                                IsValid: false,
                                FillFields: [],
                                Error: "Unique feature entry invalid"
                            }
                        }
                    }
                }
            }
        }
    
        return data;
    }
    
}
