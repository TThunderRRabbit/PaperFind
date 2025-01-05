import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [view, setView] = useState("books");
  const [bookCollection, setBookCollection] = useState(() => {
    const savedBooks = localStorage.getItem("bookCollection");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("bookCollection", JSON.stringify(bookCollection)),
      [bookCollection];
  });

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

        {view === "recommend" && <>s</>}
      </div>
    </>
  );
}

export default App;
