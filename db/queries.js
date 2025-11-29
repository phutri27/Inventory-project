class MoviesQueries{
    constructor(pool){
        this.pool = pool
    }

    // Dung de hien thi movies khi ma bam vao 1 button genre
    async getAllMovies(genreId){
        const { rows } = await this.pool.query("SELECT movies.id, poster, movie_name FROM movies JOIN movies_type ON movies.id = movie_id WHERE genres_id = ($1)",[genreId])
        console.log(rows)
        return rows
    }

    async getMovieById(movieId){
        const {rows } = await this.pool.query("SELECT * FROM movies WHERE id = ($1)", [movieId])
        return rows;
    }

    async getLastMovie(){
        const {rows} = await this.pool.query("SELECT id FROM movies ORDER BY id DESC LIMIT 1")
        return rows
    }

    async addMovie(movieName, poster){
        await this.pool.query("INSERT INTO movies (movie_name, poster) VALUES ($1, $2)", [movieName, poster])
    }

    async updateMovie(movie_name, poster, movieId){
        await this.pool.query("UPDATE movies SET movie_name=($1), poster=($2) WHERE id = ($3)", [movie_name,poster,movieId])
    }

    async deleteMovie(id){
        await this.pool.query("DELETE FROM movies WHERE id=($1)", [id])
    }

    async insertIntoMoviesType(movieId, genreId){
        await this.pool.query("INSERT INTO movies_type (movie_id, genres_id) VALUES ($1, $2)",[movieId, genreId])
    }

    async updateMoviesType(genreId, id){
        await this.pool.query("UPDATE movies_type SET genres_id = ($1) WHERE id = ($2)",[genreId, id])
    }

    async selectMoviesTypes(movieId){
        const { rows } = await this.pool.query("SELECT * FROM movies_type WHERE movie_id = ($1)", [movieId])
        return rows;
    }

    async deleteMovieTypes(movieid){
        await this.pool.query("DELETE FROM movies_type WHERE movie_id = ($1)", [movieid])
    }
}

class GenresQueries{
    constructor(pool){
        this.pool = pool
    }

    async getAllGenres(){
        const { rows } = await this.pool.query("SELECT * FROM genres")
        return rows
    }

    async getGenreByMovieId(movieId){
        const { rows } = await this.pool.query("SELECT genres_id FROM movies_type WHERE movie_id = ($1)", [movieId])
        return rows
    }

    async getGenreById(id){
        const {rows} = await this.pool.query("SELECT genre_name FROM genres WHERE id = ($1)", [id])
        return rows
    }

    async addGenre(name){
        await this.pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [name])
    }

    async updateGenre(id, name){
        await this.pool.query("UPDATE genres SET genre_name=($1) WHERE id = ($2)",[name, id])
    }

    async deleteGenre(id){
        await this.pool.query("DELETE FROM genres WHERE id=($1)", [id])
    }
}

const pool = require('./pool')
const genreDb = new GenresQueries(pool)
const movieDb = new MoviesQueries(pool)

module.exports = {
    genreDb,
    movieDb
}