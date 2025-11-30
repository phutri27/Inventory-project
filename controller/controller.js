const { genreDb, movieDb } = require("../db/queries")
const { validationResult, matchedData } = require('express-validator');
const path = require('node:path')
const multer = require('multer');
const { title } = require("node:process");
const { error } = require("node:console");
const storage = multer.diskStorage({
    destination: function (req, file , cb){
        cb(null, path.join(__dirname, "..", "public/images"))
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage})
class Controller{
    constructor(genDb, movDb){
        this.genDb = genDb
        this.movDb = movDb
        this.getAllGenres = this.getAllGenres.bind(this)
        this.getAll = this.getAll.bind(this)
        this.updateGenGet = this.updateGenGet.bind(this)
        this.updateGenPost = this.updateGenPost.bind(this)
        this.addGenPost = this.addGenPost.bind(this)
        this.deleteGenPost = this.deleteGenPost.bind(this)
        this.addMoviesGet = this.addMoviesGet.bind(this)
        this.addMoviePost = this.addMoviePost.bind(this)
        this.editMovieGet = this.editMovieGet.bind(this)
        this.editMoviePost = this.editMoviePost.bind(this)
        this.deleteMoviePost = this.deleteMoviePost.bind(this)
    }

    async getAllGenres(req, res){
        const genres = await this.genDb.getAllGenres();
        res.render("index", {
            title: "Movies category",
            genres: genres, 
            movies: [],
        })
    }

    async getAll(req, res){
        const genreId = req.params.id;
        const movies = await this.movDb.getAllMovies(genreId);
        const genres = await this.genDb.getAllGenres();

        res.render("index", {
            title: "Movies",
            genres: genres,
            movies: movies,
            genred: genreId
        });
    }

    async updateGenGet(req, res){
        const genreId = req.params.id;
        const genreName = await this.genDb.getGenreById(genreId)
        res.render("genreEditForm", {
            title: "Update genre",
            genreId: genreId,
            genreName: genreName[0].genre_name,
        })
    }

    async updateGenPost(req, res){
        const genreId = req.params.id;
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).render("genreEditForm", {
                title: "Edit genre",
                genreId: genreId,
                genreName: "",
                errors: errors.array()
            })
        }
        const { genre } = matchedData(req)
        await this.genDb.updateGenre(genreId, genre)
        res.redirect("/")
    }

    addGenGet(req, res){
        res.render("addGenreForm",{
            title: "Add genre",
        })
    }

    async addGenPost(req, res){
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).render("addGenreForm",{
                title: "Add genre",
                errors: errors.array()
            })
        }
        const {genre} = matchedData(req)
        await this.genDb.addGenre(genre)
        res.redirect("/")
    }

    async deleteGenPost(req, res){
        const genreId = req.params.genredd
        await this.genDb.deleteGenre(genreId)
        res.redirect("/")
    }

    async addMoviesGet(req, res){
        const genres = await this.genDb.getAllGenres()

        res.render("addMovieForm", {
            title: "Add a movie",
            genres: genres,
            movie_value: "",
            selectedGenres: []
        })
    }

    async addMoviePost(req, res){
        const genres = await this.genDb.getAllGenres()
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).render("addMovieForm", {
                title: "Add Movie",
                genres: genres,
                movie_value: req.body.movie_name,
                selectedGenres: req.body.genre_option.length > 0 ? req.body.genre_option : [],
                errors: errors.array(),
            })
        }
        const {genre_option, movie_name} = matchedData(req)
        await this.movDb.addMovie(movie_name, req.file.filename)
        const movie = await this.movDb.getLastMovie()
        for (const i of genre_option){
            const genreId = Number(i);
            await this.movDb.insertIntoMoviesType(movie[0].id, genreId)
        }
        res.redirect("/")
    }

    //EDIT MOVIE
    async editMovieGet(req, res){
        const id = req.params.id
        const movieInfo = await this.movDb.getMovieById(id)
        const genres = await this.genDb.getAllGenres()
        const selectedGenres = await this.genDb.getGenreByMovieId(id)
        res.render("editMovieForm", {
            title: "Edit movie",
            movieId: id,
            movieName: movieInfo[0].movie_name,
            genres: genres,
            selectedGenres: selectedGenres,
            poster: movieInfo[0].poster
        })
    }

    async editMoviePost(req, res){
        const movieId = req.params.id
        const movieInfo = req.body.movie_name
        const genres = await this.genDb.getAllGenres()
        console.log(req.body.genre_option)
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).render("editMovieForm",{
                title: "Edit movie",
                movieId: movieId,
                movieName: movieInfo,
                genres: genres,
                selectedGenres: req.body.genre_option.length > 0 ? req.body.genre_option : [],
                errors: errors.array()
            })
        }
        const {movie_name, genre_option} = matchedData(req)
        await this.movDb.updateMovie(movie_name, req.file.filename, movieId)
        await this.movDb.deleteMovieTypes(movieId)
        for (const i of genre_option){
            const genreId = Number(i)
            await this.movDb.insertIntoMoviesType(movieId, genreId)
        }
        res.redirect("/")
    }

    async deleteMoviePost(req, res){
        const movieid = req.params.movieid
        const { genreId } = req.body
        await this.movDb.deleteMovie(movieid)
        res.redirect(`/genres/${genreId}`)
    }
}

const controller = new Controller(genreDb, movieDb)
module.exports = {
    controller,
    upload
}