import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefault";
import Post from "./Post";
import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";


function PostsPage({message, filter=""}) {
  const [posts, setPosts] = useState({results:[]});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  //handling the search query
  const [query, setQuery] = useState("");

  //fetch Data from API
  useEffect(()=>{
    const fetchPosts=async()=>{
      try{
        const { data } = await axiosReq.get(`/articles/?${filter}search=${query}`)
        //when everything works as expected
        setPosts(data)
        // stop the spinner from keep loading
        setHasLoaded(true)
      }catch(err){
        console.log(err);

      }
    };

    //when user changes anything 
    setHasLoaded(false)

    const timer = setTimeout(()=>{
      fetchPosts();
    },5000)
    return ()=>{
      clearTimeout(timer)
    }
    
  },[filter, query, pathname])
  
  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        <i className={`fas fa-search align-left ${styles.SearchIcon}`}/>
        <Form 
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault() }
        >
          <Form.Control 
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search articles"
          />
            
        </Form>
        {hasLoaded ?(
          <>
            {posts.results.length?
            (
                posts.results.map((post) =>(
                  <Post key={post.id} {...post} setPosts={setPosts} />
                )
            )
            ):
            <Container className={appStyles.Content}>
              <Asset src={NoResults} message={message} />
            </Container>
            }
          </>
        ):(
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <p>Popular profiles for desktop</p>
      </Col>
    </Row>
  );
}

export default PostsPage;