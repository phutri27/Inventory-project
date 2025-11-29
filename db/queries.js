class MoviesQueries{
    constructor(pool){
        this.pool = pool
    }

    async getAllMovies(genreId){
        const { rows } = await this.pool.query("SELECT movie_name, poster FROM movies JOIN movies_type ON movies.id = movie_id WHERE genres_id = ($1)",[genreId])
        return rows
    }

    async addMovie(movieName, poster){
        await this.pool.query("INSERT INTO movies (movie_name, poster) VALUES ($1, $2)", [movieName, poster])
    }

    async updateMovie(movie_name, poster){
        await this.pool.query("UPDATE movies SET movie_name=($1), poster=($2)", [movie_name,poster])
    }

    async deleteMovie(id){
        await this.pool.query("DELETE FROM movies WHERE id=($1)", [id])
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