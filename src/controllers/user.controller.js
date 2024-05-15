import bcrypt from 'bcrypt';
import { User} from '../models/user.model.js';
import { doctorModel } from '../models/doctor.model.js';
import { appointmentModel } from '../models/appointment.model.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

//login callback-------->
const loginController = async(req,res)=>{
    try {

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).send('User Not Found');
        }

        //compare hashed password----->

        const matchPassword = await bcrypt.compare(password,user.password);

        if(!matchPassword){
            return res.status(401).send('Invalid Password')
        }

        const token = jwt.sign({id:user._id},process.env.JWT_TOKEN,{expriesIn:'1d'})

        res.status(200).send({message:'Login Success',success:true,token});
    } catch (error) {
        console.log(error);
        console.log(process.env.JWT_TOKEN);
        res.status(500).send({
            message:'error in login '
        })
    }
}

// register callback-------->
const registerController = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
          return res.status(400).json({
              success: false,
              message: 'Please provide name, email, and password.'
          });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({
              success: false,
              message: 'Invalid email format.'
          });
      }

      // Hash and salt password
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
          name,
          email,
          hashPassword
      });

      await newUser.save();

      res.status(201).json({
          success: true,
          newUser
      });
  } catch (error) {
      console.error('Registration failed:', error);
      res.status(500).json({
          success: false,
          message: 'Registration failed. Please try again later.'
      });
  }
};

const authController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Omit password from the user object before sending the response
    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const applyNewDoctorController = async(req,res)=>{
try {
  
    const newDoctor = await doctorModel({...req.body,status:'pending'}) //creates a new instance of doctormodel 
    
    await newDoctor.save() //save the new instance to the database
  
    const adminUser = await User.findOne({isAdmin:true}) //finding a user document where isadmin is true

    const notification = adminUser.notification; //this extract notification array  from admin user
    
    //this creates new notification object and pushes it into notification array
    notification.push({
      type:'apply-doctor-request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} Has Applied for A Doctor Account`,
      data:{
        doctorId:newDoctor._id,
        name:newDoctor.firstName + " " + newDoctor.lastName,
        onclickPath:"/admin/doctors",
      },
    });
  
    await User.findByIdAndUpdate(adminUser._id,{notification})
    
    res.status(201).send({
      success:true,
      message:"Doctor Account Applied Successfully"
    })
} catch (error) {

  console.log(error);
  res.status(500).send({
    success:false,
    error,
    message:"Error while Applying for doctor"
  })
  
}
}

const getAllNotificationController = async(req,res)=>{
   
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    
    const seenNotification = user.seenNotification;
   
    const notification = user.notification;
    
    seenNotification.push(...notification);//push all notification to seenNotification
    
    user.notification = [] //update after pushing to seenNotification

    user.seenNotification  = notification; //upadating seennotification

    const updatedUser = await user.save() //save the upadted user

    res.status(200).send({
      success:true,
      message:'All Notification Merked As Read',
      data:updatedUser,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'Error In Notification',
      success:false,
      error,
    })
    
  }


}

const deleteAllNotification = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clear notification and seenNotification arrays
    user.notification = [];
    user.seenNotification = [];

    // Save the updated user
    const updatedUser = await user.save();

    // Omit password from the updatedUser object before sending the response
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete notifications",
      error: error.message,
    });
  }
};



const getAllDoctorsController = async (req, res) => {
  try {
    // Find all doctors with status 'approved'
    const doctors = await doctorModel.find({ status: 'approved' });

    // Send response with the list of doctors
    res.status(200).json({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching doctors:", error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};


const bookingAvailabilityController = async(req,res)=>{

}


const bookAppointmentController = async(req,res)=>{

}

const userAppointmentsController = async(req,res)=>{

}




export {loginController,registerController,authController}