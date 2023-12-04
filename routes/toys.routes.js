const express = require("express");
const router = express.Router();
const { getToys, putToys,PostToys,deleteToys,getByName,getBycategory,getById,getByPrices } = require("../controllers/toy.controller");
const { authToken } = require("../auth/authToken");

router.get('/',getToys);
router.get('/search',getByName);
router.get('/prices',getByPrices);
router.get('/single/:id',getById);
router.get('/category/:catName',getBycategory);
router.post('/',authToken,PostToys);
router.delete("/:idDel",authToken,deleteToys );
router.put("/:idEdit",authToken,putToys );

module.exports = router;