const jwt= require("jsonwebtoken");

exports.authToken = (req,res, next)=>{
    const token = req.header("x-api-key");
    if(!token){  
        return res.status(401).json({msg:"you must send token"});
    }
    try{
        const decodeToken = jwt.verify(token,"Michal");
        console.log(decodeToken);
        res.locals.userId=decodeToken._id;
        console.log( res.locals.userId);
        next();   
     }
    catch(err){
        return res.status(401).json({msg: "token invalid or expired"});

    }   

}

