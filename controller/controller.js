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
            movies: movies
        });
    }

    updateGenGet(req, res){
        const genreId = req.params.id;
        res.render("genreEditForm", {
            title: "Update genre",
            genreId: genreId
        })
    }

    async updateGenPost(req, res){
        const genreId = req.params.id;
        console.log(genreId)
        const { genre_name } = req.body
        console.log(genre_name)
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
}

const controller = new Controller(genreDb, movieDb)
module.exports = controller