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
            FillFields: [],
            IsFranchise:false,
            IsPlatform:false,
        }

        if (requestData.biztype && requestData.biztype.length>0) {
            data.BizType=requestData.biztype;

            if (requestData.biztype==='contractor'&&requestData.platformee!==null) {
                data.ProductType = requestData.platformee.trim();
                data.IsPlatform=true;
            }
            else if (requestData.biztype!=='contractor'&&requestData.franchisee!==null) {
                data.ProductType = requestData.franchisee.trim();
                data.IsFranchise=true;
            }
            else {
                data.ProductType = requestData.product.trim();
            }

            if (requestData.money!==null&&parseFloat(requestData.money)!==NaN&&requestData.money>0&&requestData.money<1000000000000) {
                data.Money=parseFloat(requestData.money);
            }
            else {
                return {
                    IsValid: false,
                    FillFields: [],
                    Error: "Finance entry invalid"
                }
            }
         
            if (data.ProductType.length>0 && data.ProductType.length<=100) {
                if (requestData.targetedLocation && requestData.targetedLocation.trim().length>0 && requestData.targetedLocation.trim().length<200) {
                    data.TargetLocation=requestData.targetedLocation.trim(); 
                    data.IsValid=true;
                }
            }
        }
    
        return data;
    }
    
}
