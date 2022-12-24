const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required: true
        }
    }
)

// userSchema.statics.checkDuplicate = async function (str) {
    // if(!str) {
    //     throw new Error("input is invalid");
    // }
    // try {
    //     const user = await this.findOne({str})
    //     if (user){
    //         return false;
    //     }

    // } catch (error) {
    //     console.log(error);
    //     return false
    // }
// }
module.exports = mongoose.model('User', userSchema);