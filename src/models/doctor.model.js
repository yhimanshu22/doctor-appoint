import mongoose from "mongoose";
import Joi from "joi";


const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,

    },
    firstName:{
        type:String,
        required:[true,'please provide firstname'], 
    },
    lastName:{
        type:String,
        required:[true,'lastName is required']
    },
    phone:{
        type:Number,
        required:[true,'phone number is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true,
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'address is required']
    },
    specialization:{
        type:String,
        required:[true,'specialization is required']
    },
    experience:{type:String,required:true},
    feesPerConsultation:{type:Number,required:true},
    status:{type:String,default:"pending"},
    startime:{
        type:String,
        required:true,
    },
    endtime:{
        type:String,
        default:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const docJoischema = Joi.object({
    userId:Joi.string(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    phone:Joi.string().required(),
    email:Joi.string().required().email(),
    website:Joi.string(),
    address:Joi.string().required(),
    specialization:Joi.string().required(),
    experience:Joi.string().required(),
    feesPerConsultation:Joi.string().required(),
    status:Joi.string().default('pending'),
    startime:Joi.string().required(),
    endtime:Joi.string().required(),
    createdAt:Joi.date().default(Date.now)
})

//add the joi validation to the mongoose schema
doctorSchema.validateDoctor = async function(){
    return docJoischema.validateAsync(this.toObject());
};

export const doctorModel = mongoose.model('doctor',doctorSchema);
