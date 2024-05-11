import jwt from "jsonwebtoken";

module.exports = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'].split('')[1];
        jwt.verify(token, process.env.JWT_TOKEN, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    message: 'auth failed',
                    success: false,
                });
            }else{
              req.body.userId = decode.id;
              next();
            }
        });

       

    } catch (error) {
         console.log('authentication failed',error);
        res.status(401).send({
            message:'Auth Failed',
            success:false,
        })
    }
      
}