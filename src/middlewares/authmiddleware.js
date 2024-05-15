import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1]; // Correctly split the authorization header
        jwt.verify(token, process.env.JWT_TOKEN, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: 'Authentication failed',
                    success: false,
                });
            } else {
                req.body.userId = decode.id;
                next();
            }
        });
    } catch (error) {
        console.error('Authentication failed', error);
        res.status(401).send({
            message: 'Authentication failed',
            success: false,
        });
    }
};

export { authMiddleware };
