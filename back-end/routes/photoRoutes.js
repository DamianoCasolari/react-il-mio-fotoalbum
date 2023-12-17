const express = require("express")
const {body} = require("express-validator")
const multer = require("multer")


// create istance of router
const router = express.Router()

// import local files
const photosController = require("../controllers/photosController")

// define routes and link correct methods
router.get("/", photosController.index)
router.get("/:slug", photosController.show)
router.post("/",multer({ dest: "public/imgs/newPhoto" }).single("image"),photosController.create);
router.put("/:slug", photosController.edit)
router.delete("/:slug", photosController.destroy)

//export file
module.exports = router