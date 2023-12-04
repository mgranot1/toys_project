const express = require("express");
const router = express.Router();
const { getUsers,postUsers,login,deleteUsers ,putUsers} = require("../controllers/user.controller");


router.get('/',getUsers);////
router.post('/login',login );////
router.post('/',postUsers);////
router.delete("/:idDel",deleteUsers );////
router.put("/:idEdit",putUsers );//password not encreyped

module.exports = router;