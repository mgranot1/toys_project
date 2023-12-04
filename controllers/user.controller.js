const {authToken} = require("../auth/authToken");
const {UserModel, getToken}=require("../models/user.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");

exports.getUsers = async(req,res)=>{
    const data = await UserModel.find({});
    res.json(data);
}

exports.login = async(req,res)=>{
    const validBody = validLogin(req.body)
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    const data = await UserModel.findOne({email:req.body.email});
    if(!data){
        return res.status(401).json({msg:"User not found"});
    }
    const password = await bcrypt.compare(req.body.password, data.password);
    if(!password)
    {
        return res.status(401).json({msg:"Passowrd wrong"});
    }
    const newToken = getToken(data._id);
    res.json({token:newToken});



}

exports.postUsers = async(req,res)=>{
    const validBody = validUser(req.body)
    if(validBody.error){
        return res.status(400).json(validBody.error.message);
    }
    try{

    const data = new UserModel(req.body);
    data.password = await bcrypt.hash(data.password, 10);

    await data.save();
    data.pass = "****";
    res.json(data);


    }
    catch(err)
    {
        console.log(err);
        res.status(400).json({err:"Email already in system"})

    }
    
}


exports.deleteUsers = async(req,res)=>{
    try{
        const data = await UserModel.deleteOne({_id:req.params.idDel});
        if(!data.deletedCount)
        {
            res.status(400).json({msg:"user not exist!"});

        }
        else{
            res.status(200).json({msg:"deleted!"});

        }

    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

exports.putUsers = async(req,res)=>{
    const validBody = validUser(req.body)
    if(validBody.error){

        return res.status(400).json(validBody.error.message);
    }

    try{
        const data = await UserModel.updateOne({_id:req.params.idEdit}, req.body);
        res.json({msg:"updated!"});

    }
    catch(err){
        res.status(400).json({msg:"id not exist"});
    }
}

const validUser = (_bodyData) => {
    let joiSchema = Joi.object({
      fullName: {
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
      },
      email: Joi.string().min(2).max(99).email().required(),
      password: Joi.string().min(3).max(99).required(),
      role: Joi.string().valid("user","admin")
    })
  
    return joiSchema.validate(_bodyData);
  }
  const validLogin = (_bodyData) => {
    let joiSchema = Joi.object({
      email: Joi.string().min(2).max(99).email().required(),
      password: Joi.string().min(3).max(99).required()
    })
  
    return joiSchema.validate(_bodyData);
  }