const usersR = require("./users.routes");
const toysR = require("./toys.routes");

exports.routesInit = (app)=>{
    app.use('/users',usersR);
    app.use('/toys',toysR);
    app.use((error,req,res,next)=>{
        res.status(400).send({msg:error.message})
    })
    module.exports.app=app;
    

}