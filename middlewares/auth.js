const { getUser } = require("../services/auth")

async function checkAuth(req,res,next){
    const token = req.cookies.uuid
    
    if(!token) return next()

    try{
        const user = getUser(token)
        req.user = user
    }catch(error){
        return next()
    }

    return next()
}

module.exports = {checkAuth}