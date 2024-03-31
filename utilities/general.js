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
    
                    if (requestData.rawMaterialsEntry && requestData.rawMaterialsEntry.length>0 && requestData.rawMaterialsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.rawMaterialsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Raw Materials Cost", "FieldValue": requestData.rawMaterialsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                    }
                    else {
                        return {
                            IsValid: false,
                            FillFields: []
                        }
                    }
    
                    if (requestData.laborCostsEntry && requestData.laborCostsEntry.length>0 && requestData.laborCostsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.laborCostsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Labor Cost", "FieldValue": requestData.laborCostsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                    }
                    else {
                        return {
                            IsValid: false,
                            FillFields: []
                        }
                    }
    
                    if (requestData.shippingCostsEntry && requestData.shippingCostsEntry.length>0 && requestData.shippingCostsEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.shippingCostsEntry)) {
                        data.FillFields.push({"FieldType": "Reduced Shipping Cost", "FieldValue": requestData.shippingCostsEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                    }
                    else {
                        return {
                            IsValid: false,
                            FillFields: []
                        }
                    }
    
                    if (requestData.uniqueFeaturesEntry && requestData.uniqueFeaturesEntry.length>0 && requestData.uniqueFeaturesEntry.length<=300 && /^[A-Za-z0-9\.\'\s]+$/.test(requestData.uniqueFeaturesEntry)) {
                        data.FillFields.push({"FieldType": "Unique Feature", "FieldValue": requestData.uniqueFeaturesEntry.replace(/[^\x00-\x7F]/g, "").trim()});
                    }
                    else {
                        return {
                            IsValid: false,
                            FillFields: []
                        }
                    }
    
                }
            }
        }
    
        return data;
    }
    
}
