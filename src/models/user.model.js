import mongoose from "mongoose";
import zxcvbn from "zxcvbn";
import Joi from "joi";


const userjoischema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .min(6).max(100).required(),
    isAdmin:Joi.boolean().optional(),
    isDoctor:Joi.boolean().optional(),
    Notification:Joi.array().items(Joi.object({
        type:Joi.string().required(),
        message:Joi.string().required(),
        data:Joi.object({
            doctorId:Joi.string(),
            name:Joi.string(),
            onClickPath:Joi.string(),
        }).optional(),
        createdAt:Joi.date().required(),

    })).optional(),
    seenNotification:Joi.array().items(Joi.object({
        type:Joi.string().required(),
        message:Joi.string().required(),
        data:Joi.object({
            doctorId:Joi.string(),
            name:Joi.string(),
            onClickPath:Joi.string(),
        }).optional(),

    }))
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide your name'],
        
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,'please provide your password'],
        validate:[
            {
                validator:function(value){
                    const passwordStrength = zxcvbn(value).score;
                    return passwordStrength >=3; //require a min strength of 3 out of 4
                },
                message:'password is too weak'
            },
            {
                validator:function(value){
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value);
                },
                message:'password must contain atleast one uppercase letter,one lowercase,one number and one special character',
            }
        ],
        
    },
    isAdmin:{
        type:Boolean,
        dafault:false,
    },
    isDoctor:{
        type:Boolean,
        default:false,
    },
    notification:{
        type:Array,
        default:[],
    },
    seenNotification:{
        type:Array,
        default:[]
    }
},{timestamps:true})


//add joi validation to mongoose schema
userSchema.validateUser = async function(user){
    return userjoischema.validateAsync(user);
}

export const User = mongoose.model('User',userSchema);
