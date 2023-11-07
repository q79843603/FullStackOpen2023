import { useQuery } from "@apollo/client";
import { ALL_BOOKS, USER_INFO } from "./queries";

const Recommendations = ({ show }) => {
  const result = useQuery(ALL_BOOKS, { pollInterval: 2000 });
  const info = useQuery(USER_INFO, { pollInterval: 2000 });

  if (!show) {
    return null;
  }

  if (result.loading || info.loading) {
    return <div>loading...</div>;
  }

  const favoriteGenre = info.data.me.favoriteGenre;
  const books = result.data.allBooks.filter((book) => book.genres.includes(favoriteGenre) )
  console.log(books)
  return (
    <div>
      <h2>recommendations</h2>
      {favoriteGenre === null && (
        <div> No recommendations</div>
      )}
      {favoriteGenre !== null && (
        <div>
          <p>
            books in your favorite genre <strong>{favoriteGenre}</strong>
          </p>

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
        </div>
      )}
    </div>
  );
};

export default Recommendations;
