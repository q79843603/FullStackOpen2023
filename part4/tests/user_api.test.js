const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await User.deleteMany({})

    const userObject = helper.initialUser
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(userObject[0].password, saltRounds)
    const user = new User({
        username : userObject[0].username,
        name: userObject[0].name,
        passwordHash
    })
    const savedUser = await user.save()
    console.log('Saved user for testing', savedUser)
})

describe('addition of new user', () => {
    test('invalid user with no username', async () => {
        const newUser = {
            name: "Tony",
            password: "testing"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toEqual(helper.initialUser.length)
    })

    test('invalid user with no password', async () => {
        const newUser = {
            username: "tony2231313",
            name: "Tony"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toEqual(helper.initialUser.length)
    })

    test('invalid user with password length smaller than 3', async () => {
        const newUser = {
            username: "tony23",
            name: "Peter",
            password: "pw"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toEqual(helper.initialUser.length)
    })

    test('valid user added', async () => {
        const newUser = {
            username: "ken2313125",
            name: "Ken",
            password: "plor9444"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const users = await helper.usersInDb()
        expect(users.length).toEqual(helper.initialUser.length + 1)
    })

    test('username should be unique', async () => {
        const newUser = {
            username: "testing",
            password: "testing",
            name: "tester"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toEqual(helper.initialUser.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})