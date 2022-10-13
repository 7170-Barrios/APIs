const cfg = () => {
    return {
        jwt_secret:"$eCr3t#",
        jwt_expires:"5d",
        salt:10,
        db:"mongodb+srv://Agostinho:fiap2022@cluster0.lbss3e2.mongodb.net/dbusers?retryWrites=true&w=majority"
    }
}
module.exports = cfg();