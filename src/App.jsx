import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [view, setView] = useState("recommend");
  const [bookCollection, setBookCollection] = useState(() => {
    const savedBooks = localStorage.getItem("bookCollection");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const [recommendationCollection, setRecommendationCollection] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("bookCollection", JSON.stringify(bookCollection));
  }, [bookCollection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInput);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${userInput}&limit=16`
      );

      const data = await response.json();
      console.log(data.docs);

      const newBooks = data.docs.map((book) => {
        return {
          title: book.title,
        };
      });

      setBookCollection(newBooks);
    } catch {
      console.error(error);
    }
  };

  const addToRecommendation = (genre) => {
    setRecommendationCollection((prevGenre) => {
      return [...prevGenre, genre];
    });
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    console.log(recommendationCollection);

    try {
      const response = recommendationCollection.map((genre) =>
        fetch(`https://openlibrary.org/search.json?subject=${genre}&limit=10`)
      );
      const data = await Promise.all(response);
      const recommendations = await Promise.all(
        data.map((array) => array.json())
      );

      const newBooks = recommendations.flatMap((books) =>
        books.docs ? books.docs.map((book) => ({ title: book.title })) : []
      );

      setBookCollection(newBooks);
      setView("books");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="searchDiv">
        <form onSubmit={handleSubmit}>
          <input type="text" onChange={handleInputChange}></input>
          <button>Submit</button>
        </form>
      </div>

      <div className="main">
        {view === "books" && (
          <>
            <ul>
              {bookCollection.map((book, index) => (
                <li key={index}>{book.title}</li>
              ))}
            </ul>
          </>
        )}

        {view === "recommend" && (
          <>
            <form onSubmit={handleRecommendationSubmit}>
              <div className="subjectsCollection">
                <button
                  type="button"
                  onClick={() => addToRecommendation("Fiction")}
                >
                  Fiction
                </button>
                <button
                  type="button"
                  onClick={() => addToRecommendation("Children's fiction")}
                >
                  Children's
                </button>
                <button type="button">English Literature</button>
                <button type="button">General</button>
                <button type="button">History</button>
                <button type="button">Juvenile</button>
                <button type="button">Drama</button>
                <button type="button">Criticism and interpretation</button>
                <button type="button">Mystery & detective, general</button>
                <button type="button">Fantasy</button>
                <button type="button">Novela</button>
                <button type="button">Adventure and adventurers</button>
                <button type="button">Action & adventure</button>
                <button type="button">Psychological</button>
              </div>
              <button type="submit">Submit</button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default App;
