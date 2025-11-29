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

route.get("/add_movies", controller.addMoviesGet)
route.post("/add_movies", controller.addMoviePost)

route.get("/edit_movie/:id", controller.editMovieGet)
route.post("/edit_movie/:id", controller.editMoviePost)

route.post("/:movieid/deleteMovie", controller.deleteMoviePost)
module.exports = route