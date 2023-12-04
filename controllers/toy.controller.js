
const {ToyModel} = require("../models/toys.model");
const Joi = require("joi");

exports.getToys = async(req,res)=>{
    const {page = 1} = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    const data = await ToyModel.find({}).skip(skip).limit(perPage);;
    res.json(data);
}

exports.getByName = async(req, res, next) => {
    const { s, page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    if (!s) return next(new Error( 'Search query parameter (s) is required'));
    try{
    const toys = await ToyModel.find({
        $or: [ { name: { $regex: new RegExp(s, 'i') } }, { info: { $regex: new RegExp(s, 'i') } },
        ],
    }).skip(skip).limit(perPage);
    res.status(200).json(toys);
    }
    catch(err)
    {res.status(400).json({msg:"name or info not found"});}
};

exports.getByPrices= async(req,res,next)=>{
    const { min,max, page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    if (!min || !max) return next(new Error( 'Prices query parameters min and max are required'));
    try{
        const toys = await ToyModel.find(
            {
                $and: [ { price: { $gte: parseFloat(min) } }, { price: { $lte: parseFloat(max)} },],
            }).skip(skip).limit(perPage);            

        if (toys.length === 0) {
            return res.status(404).json({ msg: 'No toys found within the specified price range' });
        }
        res.status(200).json(toys);

    }
    catch(err)
    {res.status(400).json({msg:"name or info not found"});}


}



exports.getById=async(req, res, next)=>{
    try{
        const data = await ToyModel.findOne({_id:req.params.id});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(400).json({msg:"toy not exist"});
    }


}


exports.getBycategory = async(req, res, next) => {
    const { page = 1 } = req.query;
    const perPage = 10;
    const skip = (page - 1) * perPage;
    try{
        let catN = req.params.catName;
        let catReg = new RegExp(catN,"i")
        let data = await ToyModel.find({category:catReg})
        .limit(perPage)
        .skip(skip)
        res.json(data);
      }
      catch(err){
        console.log(err);
        res.status(500).json({msg:"there error try again later",err})
      }


};



exports.PostToys = async(req,res,next)=>{
    const validBody = validateToy(req.body)
    if(validBody.error){
        return res.status(400).json(validBody.error.message);
    }

    const data = new ToyModel(req.body);
    console.log("userId "+res.locals.userId);
    data.user_id=res.locals.userId;
    await data.save();
    res.json(data);
}
exports.deleteToys =async(req,res)=>{
    try{
        const data = await ToyModel.deleteOne({_id:req.params.idDel});
        if(!data.deletedCount)
        {
            res.status(400).json({msg:"toy not exist!"});

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
exports.putToys = async(req,res)=>{
    const validBody = validateToy(req.body)
    if(validBody.error){
        return res.status(400).json(validBody.error.message);
    }
    try{
        const data = await ToyModel.updateOne({_id:req.params.idEdit}, req.body);
        res.json({msg:"updated!"});
    }
    catch(err){
        res.status(400).json({msg:"id not exist"});

    }
}


const validateToy = (_reqBody) =>{
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(100).required(),
        category: Joi.string().min(3).max(15).required(),
        img_url: Joi.string().allow(null, "").max(500),
        price: Joi.number().min(1).max(9999).required(),
        user_id:Joi.string()
    })
    return schemaJoi.validate(_reqBody);
}
