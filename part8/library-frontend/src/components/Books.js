import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "./queries";
import { useState } from "react";

const Books = (props) => {
  const [genre, setGenre] = useState('')

  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }
  
  if (result.loading) {
    return <div>loading...</div>;
  }

  const temp = result.data.allBooks;
  const copy = temp.map(book => book.genres).flat()
  const genres = [...new Set(copy)]

  const books = temp.filter(book => genre === '' ? book : book.genres.includes(genre))
  return (
    <div>
      <h2>books</h2>
      {genre !== null && 
      <p>in genre <strong>{genre}</strong></p>
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  );
};

export default Books;
