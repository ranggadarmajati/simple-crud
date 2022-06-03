const indicative = require('indicative/validator')
const rules = {
    "email": "required|email",
    "firstName": "required",
    "lastName": "required",
    "address": "required",
    "phone": "required"
}
const messages = {
    "email.required": "email is required",
    "email.email": "invalid email format",
    "firstName.required": "firstName is required",
    "lastName.required": "lastName is required",
    "address.required": "address is required",
    "phone.required": "phone is required"
}
const storeUserValidator = (payload) => {
   return indicative.validateAll(payload, rules, messages).then(valid => {
        return {
            status: true,
            data: valid
        }
    }).catch(e => {
        console.error("error validator::", e)
        return {
            status: false,
            data: e
        }
    })
}
module.exports = {
    storeUserValidator
}