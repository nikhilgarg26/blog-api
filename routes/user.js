const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { createHmac } = require('crypto')
const { setUser } = require('../services/auth')

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/signup', async (req, res) => {
    const body = req.body
    const user = new User({
        fullName: body.fullName,
        email: body.email,
        password: body.password,
    })

    await user.save()

    return res.redirect('/')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) throw new Error('User not found')

        const pass = createHmac('sha256', user.salt)
            .update(password)
            .digest('hex')

        if (pass !== user.password) throw new Error('Incorrect Password')

        const token = setUser(user);

        res.cookie('uuid', token)
        return res.redirect('/')
    }
    catch {
        return res.render('login', { error: 'Email or Password incorrect.' })
    }

})

router.get('/logout', (req,res)=>{
    res.clearCookie('uuid').redirect('/')
})

module.exports = router