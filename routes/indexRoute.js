const { Router } = require('express')
const path = require('path');
const route = Router();
const {controller, upload} = require("../controller/controller")
const {validateGenre, validateMovie} = require("../controller/validation")

route.get("/", controller.getAllGenres)
route.get("/genres/:id", controller.getAll)

route.get("/edit_genres/:id", controller.updateGenGet)
route.post("/edit_genres/:id", validateGenre, controller.updateGenPost)

route.get("/add_genres", controller.addGenGet)
route.post("/add_genres", validateGenre, controller.addGenPost)

route.post("/:genredd/delete", controller.deleteGenPost)

route.get("/add_movies", controller.addMoviesGet)
route.post("/add_movies", upload.single('poster'), validateMovie, controller.addMoviePost)

route.get("/edit_movie/:id", controller.editMovieGet)
route.post("/edit_movie/:id", upload.single('poster'), validateMovie, controller.editMoviePost)

route.post("/:movieid/deleteMovie", controller.deleteMoviePost)

module.exports = route