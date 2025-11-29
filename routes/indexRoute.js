const { Router } = require('express')
const route = Router();
const controller = require('../controller/controller')

route.get("/", controller.getAllGenres)
route.get("/genres/:id", controller.getAll)

route.get("/edit_genres/:id", controller.updateGenGet)
route.post("/edit_genres/:id", controller.updateGenPost)

route.get("/add_genres", controller.addGenGet)
route.post("/add_genres", controller.addGenPost)

route.post("/:genredd/delete", controller.deleteGenPost)

module.exports = route