const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (args.author && args.genre) {
          const allBook = await Book.find({}).populate("author");
          return allBook.filter(
            (book) =>
              book.author.name === args.author && book.genres.includes(args.genre)
          );
        } else if (args.author) {
          const allBook = await Book.find({}).populate("author");
          return allBook.filter((book) => book.author.name === args.author);
        } else if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate("author");
        } else return Book.find({}).populate("author");
      },
      allAuthors: async () => {
        console.log('Author find')
        const authors = await Author.find({});
        const books = await Book.find({}).populate("author");
        const allAuthors = authors.map((author) => {
          const count = books.filter(
            (book) => book.author.name === author.name
          ).length;
          const test = {
            id: author.id,
            born: author.born,
            name: author.name,
            bookCount: count,
          };
          return test;
        });
        return allAuthors;
      },
      me: (root, args, context) => {
        return context.currentUser;
      },
    },
    Mutation: {
      addBook: async (root, args, context) => {
        // const book = { ...args, id: uuid() }
        // books = books.concat(book)
        // if (!authors.find(author => author.name === args.author))
        // {
        //     const newAuthor = {
        //         name: args.author,
        //         id: uuid()
        //       }
        //     authors = authors.concat(newAuthor)
        // }
        // return book
        if (!context.currentUser) {
          throw new GraphQLError("No Permission", {
            extensions: { code: "USER_NOT_LOGGEDIN" },
          });
        }
        console.log(args);
        if (args.title.length < 5) {
          throw new GraphQLError(
            "Invalid argument (The min length of title is 5))",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.title,
              },
            }
          );
        }
        if (args.author.length < 4) {
          throw new GraphQLError(
            "Invalid argument (The min length of author is 4))",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
              },
            }
          );
        }
  
        const newAuthor = new Author({
          name: args.author,
        });
        await newAuthor.save();
        console.log("saved", newAuthor);
        const book = new Book({ ...args, author: newAuthor._id });
        try {
          await book.save();
        } catch (error) {
          throw new GraphQLError("Adding book failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book.populate("author")})
        return book.populate("author");
      },
      editAuthor: async (root, args, context) => {
        // const author = authors.find(author => author.name === args.name)
        // if (!author){
        //     return null
        // }
  
        // const updatedAuthor = { ...author, name: args.name, born: args.setBornTo}
        // authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
        // return updatedAuthor
        if (!context.currentUser) {
          throw new GraphQLError("No Permission", {
            extensions: { code: "USER_NOT_LOGGEDIN" },
          });
        }
        const author = await Author.findOne({ name: args.name });
        author.born = args.setBornTo;
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Editing author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
        return author;
      },
      createUser: async (root, args) => {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });
        try {
          await user.save();
        } catch (error) {
          throw new GraphQLError("Creating the user failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.username,
              error,
            },
          });
        }
        return user;
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username });
  
        if (!user || args.password !== "secret") {
          throw new GraphQLError("wrong credentials", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }
  
        const userForToken = {
          username: user.username,
          id: user._id,
        };
  
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
      },
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      }
    },
  };

module.exports = resolvers