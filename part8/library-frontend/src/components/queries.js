import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
    }
    published
    genres
  }
`
const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`
const EDIT_AUTHOR = gql`
mutation ($name: String!, $born: Int!)
{
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name
    born
  }
}
`
const CREATE_BOOK = gql`
mutation($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
  addBook(
    title: $title, 
    author: $author, 
    published: $published, 
    genres: $genres
    ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const ALL_BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`
const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password ){
    value
  }
}
`

const USER_INFO = gql`
query Me {
  me {
    username
    favoriteGenre
  }
}
`
export {ALL_AUTHORS, EDIT_AUTHOR, CREATE_BOOK, ALL_BOOKS, LOGIN, USER_INFO, BOOK_ADDED} 