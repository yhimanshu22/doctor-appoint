import Joi from "joi";
import mongoose from "mongoose";

const appointmentschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    doctorId:{
        type:String,
        required:true,
    },
    doctorInfo:{
        type:String,
        required:true,
    },
    userInfo:{
        type:String,
        required:true,
    },
    date:{type:Date,required:true},
    status:{
        type:String,
        required:true,
        default:'pending',
    },
    time:{
        type:String,
        required:true,
    }
},{timestamps:true })

//define a joi schema---->
const appointJoischema = Joi.object({
    userId:Joi.string().required(),
    doctorId:Joi.string().required(),
    doctorInfo:Joi.string().required(),
    userInfo:Joi.string().required(),
    date:Joi.date().required(),
    status:Joi.string().required().default('pending'),
    time:Joi.string().required(),
}).options({stripUnknown:true});

appointmentschema.valiadateAppointment = async function(){
    return appointJoischema.validateAsync(this.toObject());
}

export const appointmentModel = mongoose.model('appointment',appointmentschema);
