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
            data.ProductType = requestData.product.replace(/[^\x00-\x7F]/g, "").trim();
            if (data.ProductType.length<=100 && /^[A-Za-z0-9\.\'\s]+$/.test(data.ProductType)) {
                if (requestData.targetedLocation && requestData.targetedLocation.length>0 && requestData.targetedLocation.length<200 && /^[A-Za-z0-9\,\s]+$/.test(requestData.targetedLocation)) {
                    data.TargetLocation=requestData.targetedLocation.replace(/[^\x00-\x7F]/g, ""); 
                    data.IsValid=true;
    
                    if (requestData.marketingEntry) {
                        if (requestData.marketingEntry.length>0 && requestData.marketingEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.marketingEntry)) {
                            data.FillFields.push({"FieldType": "Marketing", "FieldValue": requestData.marketingEntry.replace(/[^\x00-\x7F]/g, "").trim()});
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
                        if (requestData.costsEntry.length>0 && requestData.costsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.costsEntry)) {
                            data.FillFields.push({"FieldType": "Cost", "FieldValue": requestData.costsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
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
                        if (requestData.uniqueFeaturesEntry.length>0 && requestData.uniqueFeaturesEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.uniqueFeaturesEntry)) {
                            data.FillFields.push({"FieldType": "Unique Feature", "FieldValue": requestData.uniqueFeaturesEntry.replace(/[^\x00-\x7F]/g, "").trim()});
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
