import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import Accordion from 'react-bootstrap/Accordion'
import { axiosRes } from "../../api/axiosDefault";


const Post = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  //to get the current logged in user
  const currentUser = useCurrentUser();
  //check if the current user is the same as the owner 
  const is_owner = currentUser?.username === owner;

  //handling likes
  const handleLike = async () => {
    try {
      console.log("post Id is : ", {id})
      const { data } = await axiosRes.post("/likes/",{article:id});
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post;
        }),
      }));
    } catch (err) {
      console.log(err);
      console.log("Error:", err.response.data);
      console.log("Error:", err.response ? err.response.data : err.message);
    }
  };

  //handle unlike
  const handleUnlike = async ()=>{
    try{
      await axiosRes.delete(`/likes/${like_id}`);
      setPosts((prevPosts)=>({
        ...prevPosts,
        results: prevPosts.results.map((post)=>{
          return post.id === id ? {...post, likes_count:post.likes_count-1, like_id:null}: post;
        })
      }))
    }catch(err){
      console.log(err)}
  };

  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {/**this is where we will show the dropdown menu */}
            {is_owner && postPage && " Any"}
          </div>
        </Media>
      </Card.Body>

      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>

      <Accordion defaultActiveKey="1">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            {title && <Card.Title className="text-center">{title}</Card.Title>}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>{content && <Card.Text>{content}</Card.Text>}</Card.Body>
          </Accordion.Collapse>
        </Card>
        
      </Accordion>

      <Card.Body>
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick= { handleLike }>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;