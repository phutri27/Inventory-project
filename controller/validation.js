const { body } = require("express-validator")

const emptyErr = "must not be empty"
exports.validateGenre = [
    body("genre").trim()
    .notEmpty().withMessage(`Genre name ${emptyErr}`)
]

exports.validateMovie = [
    body("movie_name").trim()
    .notEmpty().withMessage(`Movie name ${emptyErr}`),
    body("genre_option").trim()
    .notEmpty().withMessage(`Genre option ${emptyErr}`),
    body("poster").trim()
    .custom((value, {req}) => {
        if (!req.file){
            throw new Error(`Poster ${emptyErr}`)
        }
        if (req.file.size > 5 * 1024 * 1024){
            throw new Error("File size out of reach")
        }
        return true
    })
]

