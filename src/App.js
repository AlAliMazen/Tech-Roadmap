import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import axiosDefaults from "./api/axiosDefault"
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostcreateForm";




function App() {
 
  return (
   
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" render={() => <h1>Home Page</h1>} />
              <Route exact path="/courses" render={() => <h1>Courses</h1>} />
              <Route exact path="/articles" render={() => <h1>Articles</h1>} />
              <Route exact path="/categories" render={() => <h1>Categories</h1>}/>
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="articles/create" render = {() => <PostCreateForm/>}/>
              <Route render={() => <p>PAGE NOT FOUND</p>} />
            </Switch>
          </Container>
        </div>
      
  );
}

export default App;
