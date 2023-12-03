const jwt = require('jsonwebtoken')

const SECRET = 'Nikhil$123'
function setUser(user){
    return jwt.sign({
        fullName: user.fullName,
        _id:user._id,
        email: user.email,
        profileImageURL:user.profileImage
    }, SECRET)
}

function getUser(token){
    return jwt.verify(token, SECRET)
}

module.exports = {setUser, getUser}