import React, {
  useState,
  // useEffect
} from "react";
// import { useLocation } from "react-router-dom";
import styles from "./ForumPost.module.css";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { UserInfo } from "./UserInfo";
// import { ForumPostProps } from "./Type";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";

const ForumPost: React.FC = () => {
  // // Fetch data from the backend by query string id
  // const location = useLocation();
  // const query = new URLSearchParams(location.search);
  // const postId = query.get("id");
  // const [post, setPost] = useState<ForumPostProps["post"]>({
  //   content: "",
  //   postAuthor: "",
  //   timestamp: "",
  // });
  // const [userInfo, setUserInfo] = useState<ForumPostProps["userInfo"]>({
  //   elo: 0,
  //   university: "",
  //   avatarSrc: "",
  // });
  // const [commentList, setCommentList] = useState<ForumPostProps["commentList"]>(
  //   []
  // );
  // const [postTitle, setPostTitle] = useState<ForumPostProps["postTitle"]>("");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3001/api/post`), {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       };
  //       const data = await response.json();
  //       setPost(data.post);
  //       setUserInfo(data.userInfo);
  //       setCommentList(data.commentList);
  //       setPostTitle(data.postTitle);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [postId]);
  const post = {
    content:
      "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life: it helps us manage finances, calculate distances, and understand measurements in various contexts like cooking or construction. It also enables us to make predictions, analyze data, and improve efficiency in fields such as technology, engineering, and science. Mathematics shapes logical thinking and enhances problem-solving skills, making it a vital part of our daily activities.\nI love Mathematics so much !!!",
    postAuthor: "phuloi1512",
    timestamp: "17:32 3/12/2024",
  };
  const userInfo = {
    elo: 1500,
    university: "HCMUS",
    avatarSrc: "https://www.w3schools.com/howto/img_avatar.png",
  };
  const commentList = [
    {
      content:
        "I'm completely on board with your perspective!\nIf there's only one person left in this world who loves math, that person is definitely me!",
      votes: 10,
      author: "vtphatt2",
      timestamp: "17:01 22/3/2024",
    },
    {
      content:
        "Damn it, I absolutely hate math. I just got a 2 in Calculus and a 3 in Probability and Statistics.\nIs there a way for people to get better at math?",
      votes: 5,
      author: "congthanh",
      timestamp: "16:05 22/3/2024",
    },
  ];
  const postTitle = "Why is mathematics important in real life?";
  const [comment, setComment] = useState("");
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
    if (event.target.value.length > 5000) {
      event.target.value = event.target.value.slice(0, 5000);
      setComment(event.target.value);
    }
    const commentCount = document.getElementById("commentCount");
    if (commentCount) {
      commentCount.textContent = `${event.target.value.length}/5000`;
    }
  };
  const sendComment = async () => {
    // if (comment.length === 0) {
    //   alert("Please write a comment before sending.");
    //   return;
    // }

    // const jsonData = JSON.stringify({
    //   content: comment,
    //   commentAuthor: "", // User's id
    //   timestamp: new Date().toLocaleString(),
    // });
    // try {
    //   const response = await fetch("http://localhost:3001/api/comment", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: jsonData,
    //   });

    //   if (!response.ok) {
    //     alert("Failed to send comment. Please try again.");
    //   } else {
    //     alert("Comment sent successfully!");
    //     setComment("");
    //     const commentCount = document.getElementById("commentCount");
    //     if (commentCount) {
    //       commentCount.textContent = "0/5000";
    //     }
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    return;
  };
  return (
    <main className={styles.forumPost}>
      <NavBar />
      <article className={styles.postContainer}>
        <h2 className={styles.postTitle}>{postTitle}</h2>
        <div className={styles.postLayout}>
          <Post {...post} />
          <UserInfo {...userInfo} />
        </div>
      </article>
      <hr className={styles.divider} />
      <section className={styles.commentSection}>
        {commentList.map((comment, index) => (
          <Comment key={index} {...comment} />
        ))}
      </section>
      <form className={styles.commentForm}>
        <textarea
          className={styles.commentInput}
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <Button label="Send" onClick={sendComment} />
        <p className={styles.commentCount} id="commentCount">
          0/5.000
        </p>
      </form>
      <p className={styles.commentGuideline}>
        Please read the forum rules carefully. Negative comments may result in a
        24-hour ban.
      </p>
    </main>
  );
};

export default ForumPost;
