import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onFilteredIngredients } = props;

  const [filteredInput, setFilteredInput] = useState("");

  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredInput === inputRef.current.value) {
        const queryParams =
          filteredInput.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${filteredInput}"`;
        axios
          .get(
            "https://react-hooks-practice-158e8.firebaseio.com/ingredients.json" +
              queryParams
          )
          .then((response) => {
            const loadedIngredients = [];
            for (let key in response.data) {
              loadedIngredients.push({
                id: key,
                title: response.data[key].title,
                amount: response.data[key].amount,
              });
            }
            onFilteredIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filteredInput, onFilteredIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filteredInput}
            onChange={(event) => setFilteredInput(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
