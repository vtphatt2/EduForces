import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./pages/Login/Login.tsx";
import ForumPost from "./pages/Forum/ForumPost.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <ForumPost
      post={{
        content:
          "Mathematics is integral to real life because it provides tools and frameworks for solving problems, making decisions, and understanding the world around us. Here are key reasons why mathematics is essential in everyday life: it helps us manage finances, calculate distances, and understand measurements in various contexts like cooking or construction. It also enables us to make predictions, analyze data, and improve efficiency in fields such as technology, engineering, and science. Mathematics shapes logical thinking and enhances problem-solving skills, making it a vital part of our daily activities.\n I love Mathematics so much !!!",
        postAuthor: "phuloi1512",
        timestamp: "2024-12-14 14:00:00",
      }}
      userInfo={{
        elo: 1000000,
        university: "University of Science, VNU-HCMUS",
        avatarSrc: "https://www.w3schools.com/howto/img_avatar.png",
      }}
      commentList={[
        {
          content:
            "I'm completely on board with your perspective!\nIf there's only one person left in this world who loves math, that person is definitely me!",
          votes: -10,
          author: "vtphatt2",
          timestamp: "2024-12-14 14:00:01",
        },
        {
          content:
            "Damn it, I absolutely hate math. I just got a 2 in Calculus and a 3 in Probability and Statistics.\nIs there a way for people to get better at math?",
          votes: 4,
          author: "congthanh",
          timestamp: "2024-12-14 14:01:00",
        },
      ]}
      postTitle="Why is mathematics important in real life?"
    />
  </StrictMode>
);
