import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostcreateForm";
import PostPage from "./pages/posts/PostPage";
import CategoryPage from "./pages/categories/CategoryPage";
import CoursesPage from "./pages/courses/CoursesPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";




function App() {
  //we nee to know the current user 
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (

    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route 
            exact path="/" 
            render={() => (
            <PostsPage message="No results found. Adjust the search keyword." />
            )} 
          />
          <Route 
            exact path="/Feed" 
            render={() => (
            <PostsPage 
            message="No results found. Adjust the search keyword or follow a user."
            filter={`owner__followed__owner__profile=${profile_id}&`}
            />
            )} 
          />
          <Route 
            exact path="/liked" 
            render={() => (
            <PostsPage 
              message="No results found. Adjust the search keyword or like a post." 
              filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&` }
            
            />
            )} 
          />
          <Route exact path="/" render={() => (<PostsPage message="No results found. Adjust the search keyword." />)} />
          <Route exact path="/courses" render={() => <CoursesPage />} />
          <Route exact path="/articles/:id" render={() => <PostPage />} />
          <Route exact path="/categories" render={() => <CategoryPage />} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/articles/create" render={() => <PostCreateForm />} />
          <Route render={() => <p>PAGE NOT FOUND</p>} />
        </Switch>
      </Container>
    </div>

  );
}

export default App;
