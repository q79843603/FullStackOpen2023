const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

const userExtractor = (request, response, next) => {
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    User.findById(decodedToken.id)
        .then(user => {
            request.user = user.username
        })
        .catch(error => next(error))
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    console.log('Error', error.name)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

module.exports = {
    tokenExtractor,
    userExtractor,
    errorHandler
}