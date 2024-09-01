import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostcreateForm";
import PostPage from "./pages/posts/PostPage";
import CategoryPage from "./pages/posts/CategoryPage";
import CoursesPage from "./pages/posts/CoursesPage";




function App() {
 
  return (
   
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" render={() => <h1>Home Page</h1>} />
              <Route exact path="/courses" render={() => <CoursesPage/>} />
              <Route exact path="/articles/:id" render={() => <PostPage />  } />
              <Route exact path="/categories" render={() => <CategoryPage/>}/>
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="/articles/create" render = {() => <PostCreateForm/>}/>
              <Route render={() => <p>PAGE NOT FOUND</p>} />
            </Switch>
          </Container>
        </div>
      
  );
}

export default App;
