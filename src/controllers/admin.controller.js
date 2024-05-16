import { doctorModel } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";


const getAllUsersController = async(req,res)=>{
    try {
        const users = await User.find({})
        res.status(200).send({
            success:true,
            message:'Users data list',
            data:users,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetching users",
            error:error.message,
        })
    }
}

const getAllDoctorsController = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success:true,
            message:'Doctors data list',
            data:doctors

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:true,
            message:"error while getting doctors data",
            error:error.message
        })
    }
}


const changeAccooutStatusController = async(req,res)=>{
    try {
        const {doctorId,status} = req.body;
        //update the status of doctor's account
        const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status});
        //find the user associated with the doctor
        const user = await User.fidnOne({_id:doctor.userId});
        //push a notification to the user's notifications array
        const notification = user.notification;
    
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your account request has been ${status}`,
            onClickPath:'/notification',
        })
        // update the isdoctor flag based on the status
        user.isDoctor = status == 'approved' ? true : false;
        //save the updated user document
        await user.save()
        //send the updated user document
        req.status(201).send({
            success:true,
            message:'Account status updated',
            data:doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in account status",
            error:error.message,
        })
    }
}