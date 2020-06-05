import React, { useReducer, useCallback, useMemo } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = (props) => {
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredients = useCallback((ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    axios
      .post(
        "https://react-hooks-practice-158e8.firebaseio.com/ingredients.json",
        ingredient
      )
      .then((response) => {
        // setIsLoading(false);
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: response.data.name, ...ingredient },
        // ]);
        dispatchHttp({ type: "RESPONSE" });
        dispatch({
          type: "ADD",
          ingredient: { id: response.data.name, ...ingredient },
        });
      });
  }, []);

  const removeIngredientsHandler = useCallback((ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    axios
      .delete(
        `https://react-hooks-practice-158e8.firebaseio.com/ingredients/${ingredientId}.json`
      )
      .then((response) => {
        // setIsLoading(false);
        // setIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatchHttp({ type: "RESPONSE" });
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        // setError(error.message);
        // setIsLoading(false);
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  }, []);

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: "CLEAR" });
  };

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientsHandler}
      />
    );
  }, [ingredients, removeIngredientsHandler]);

  return (
    <div>
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredients={addIngredients}
        loading={httpState.loading}
      />
      <section>
        <Search onFilteredIngredients={filterIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
