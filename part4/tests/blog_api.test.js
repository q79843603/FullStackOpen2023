const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

beforeEach(async () => {
    await Blog.deleteMany({})
    const user = await User.find({ name: 'tester' })
    const userjson = user[0].toJSON()
    
    const blogObject = helper.initialBlogs.map(blog => {
        blog.user = userjson.id
        return new Blog(blog)
    })
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('view the initial blogs', () => {
    test('blogs are returned as json', async () => {

        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })

    test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()

    })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: " testing",
            author: "testing",
            url: "http://testing.com",
            likes: 0
        }
     
        await api
            .post('/api/blogs')
            .set('authorization' ,`Bearer ${config.TOKEN}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

        const authors = blogs.map(blog => blog.author)
        expect(authors).toContain('testing')
    })

    test('a blog without likes can be added', async () => {
        const newBlog = {
            title: " testingnolikes",
            author: "testing",
            url: "http://testing.com"
        }
        
        await api
            .post('/api/blogs')
            .set('authorization' ,`Bearer ${config.TOKEN}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
        console.log(blogs[blogs.length - 1])
        expect(blogs[blogs.length - 1].likes).toEqual(0)
    })

    test('a blog without author or url cannot be added', async () => {
        const newBlog = {
            author: "testingnotitleurl",
            likes: 0
        }
        await api
            .post('/api/blogs')
            .set('authorization' ,`Bearer ${config.TOKEN}`)
            .send(newBlog)
            .expect(400)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    }, 100000)

})

describe('action to a single blog', () => {
    test('successful deletion with code 204 if the id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('authorization' ,`Bearer ${config.TOKEN}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('successful update if the id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const toBeUpdated = {
            title: 'Updated Blog'
        }
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('authorization' ,`Bearer ${config.TOKEN}`)
            .send(toBeUpdated)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(blog => blog.title)
        expect(titles).toContain(toBeUpdated.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})