const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const totallikes = blogs.reduce((total, blog) => {
        return { likes: total.likes + blog.likes }
    })
    return totallikes.likes
}

const favoriteBlog = (blogs) => {
    const mostLiked = blogs.reduce((prev, current) => (prev.likes >= current.likes) ? prev : current)
    const result = {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
    return result
}

const mostBlogs = (blogs) => {
    const repeatBlog = []
    let blogCount = 0
    for (let i = 0; i < blogs.length; i++) {
        blogCount = 0
        for (let j = i; j < blogs.length; j++) {
            if (blogs[i].author === blogs[j].author) {
                blogCount++
            }
        }
        if (!repeatBlog.some(obj => obj.author === blogs[i].author)) {
            let temp = {
                author: blogs[i].author,
                blogs: blogCount
            }
            repeatBlog.push(temp)
        }
    }
    const result = repeatBlog.reduce((prev, current) => (prev.blogs >= current.blogs) ? prev : current)
    return result
}

const mostLikes = (blogs) => {
    const repeatBlog = []
    let likeCount = 0
    for (let i = 0; i < blogs.length; i++) {
        likeCount = 0
        for (let j = i; j < blogs.length; j++) {
            if (blogs[i].author === blogs[j].author) {
                likeCount += blogs[j].likes
            }
        }
        if (!repeatBlog.some(obj => obj.author === blogs[i].author)) {
            let temp = {
                author: blogs[i].author,
                likes: likeCount
            }
            repeatBlog.push(temp)
        }
    }
    const result = repeatBlog.reduce((prev, current) => (prev.likes >= current.likes) ? prev : current)
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}