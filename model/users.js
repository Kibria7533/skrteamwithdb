const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
     
    },
   
    eduction_institute:{
      type: String
     
    },
    DepertmentName:{
      type: String
      
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin", "superadmin"]
      },
    Address:{
      type: String
     
    },
    Mobile:{
      type: String
      
    },
    email: {
      type: String,
      required: true
    },
   
    password: {
      type: String,
      
    },
    confirmed : {
   type:Boolean,
   default:false
  },
  },
 
  { timestamps: true }
);

module.exports = model("users", UserSchema);
