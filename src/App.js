import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

//the following two varibale, has to do with context variable
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  // to get who and whether the user is looged in, we need to send
  // Network request
  const handleMount = async () => {
    try {
      const { data } = await axios.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" render={() => <h1>Home Page</h1>} />
              <Route exact path="/courses" render={() => <h1>Courses</h1>} />
              <Route exact path="/articles" render={() => <h1>Articles</h1>} />
              <Route
                exact
                path="/categories"
                render={() => <h1>Categories</h1>}
              />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route render={() => <p>PAGE NOT FOUND</p>} />
            </Switch>
          </Container>
        </div>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
