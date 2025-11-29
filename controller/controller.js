const { genreDb, movieDb } = require("../db/queries")
const { validationResult, matchedData } = require('express-validator');

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
        const { genre_name } = req.body
        await this.genDb.updateGenre(genreId, genre_name)
        res.redirect("/")
    }

    addGenGet(req, res){
        res.render("addGenreForm",{
            title: "Add genre"
        })
    }

    addGenPost(req, res){
        const {genre} = req.body
        this.genDb.addGenre(genre)
        res.redirect("/")
    }

    deleteGenPost(req, res){
        const genreId = req.params.genredd
        this.genDb.deleteGenre(genreId)
        res.redirect("/")
    }

    async addMoviesGet(req, res){
        const genres = await this.genDb.getAllGenres()

        res.render("addMovieForm", {
            title: "Add a movie",
            genres: genres
        })
    }

    async addMoviePost(req, res){
        const {genre_option, movie_name, poster} = req.body
        await this.movDb.addMovie(movie_name, poster)
        const movie = await this.movDb.getLastMovie()
        console.log(movie)
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
        const {movieName, genre_option, poster} = req.body
        const movieId = req.params.id
        await this.movDb.updateMovie(movieName, poster, movieId)
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
module.exports = controller