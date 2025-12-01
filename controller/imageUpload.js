const cloudinary = require('../cloudy')
const {upload} = require('./controller')

function uploadImage(req, res, next){
    cloudinary.uploader.upload(req.file.path, function (err, result){
        if (err){
            console.log(err)
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }
        const url = cloudinary.url(result.public_id)    
        res.locals.posterUrl = url
        next()
    })

}

module.exports = uploadImage