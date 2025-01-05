import { useState } from "react";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [view, setView] = useState("books");
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInput);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${userInput}&limit=16`
      );

      const data = await response.json();
      console.log(data.docs);
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

      <div className="main">{view === "books" && <>Hello</>}</div>
    </>
  );
}

export default App;
