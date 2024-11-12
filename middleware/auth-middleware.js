const jwt = require('jsonwebtoken');
const authMiddleware = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    const token =authHeader && authHeader.split(" ")[1]; 
    if(!token){
        return res.status(401).json({
            success : false,
            message : 'Access denied'
        })
    }
    
    //decode this token
    try{
       const decodeedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
       req.userInfo = decodeedToken;
       next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Access denied"
        })
    }
}

module.exports = authMiddleware;