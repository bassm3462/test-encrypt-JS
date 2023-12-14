const mongoose=require("mongoose")
//const {Schema,model}=mongoose;
const encryptSchema = new mongoose.Schema({
    encryptedText:String,
    password:String,
})
const Encrypt=mongoose.model("Encrypt",encryptSchema)
module.exports=Encrypt