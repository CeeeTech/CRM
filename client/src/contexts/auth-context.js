import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import jwt from "jsonwebtoken";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      // If payload (user) is provided, then isAuthenticated
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    let decodedToken = null;

    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";

      // If authenticated, try to retrieve the token
      if (isAuthenticated) {
        const token = window.sessionStorage.getItem("token");

        // Decode the token to get user information
        decodedToken = jwt.decode(token);

        // Store the decoded token in the context state
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: decodedToken,
        });
      }
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.INITIALIZE,
      payload: decodedToken,
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  // const skip = () => {
  //   try {
  //     window.sessionStorage.setItem("authenticated", "true");
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   const user = {
  //     id: "5e86809283e28b96d2d38537",
  //     avatar: "/assets/avatars/avatar-anika-visser.png",
  //     name: "Anika Visser",
  //     email: "anika.visser@devias.io",
  //   };

  //   dispatch({
  //     type: HANDLERS.SIGN_IN,
  //     payload: user,
  //   });
  // };

  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      // Save authentication status and token in session storage
      try {
        window.sessionStorage.setItem("authenticated", "true");
        window.sessionStorage.setItem("token", data.token);
      } catch (err) {
        console.error(err);
      }

      // Log the decoded token to check its structure
      const decodedToken = jwt.decode(data.token);
      console.log("Decoded Token:", decodedToken);

      // Dispatch action to update the context state with the authentication status
      dispatch({
        type: HANDLERS.SIGN_IN,
      });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        decodedToken: state.user, // assuming user contains decoded token
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
