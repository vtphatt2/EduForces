import "./ForumPost.css";
import NavigationBar from "../../share/...";

function PostTitle(title: string) {
  return <h1 className="post-title">{title}</h1>;
}

function PostDescription(description: string) {
  return <p className="post-description">{description}</p>;
}

function PostInfo(username: string, date: string) {
  return (
    <h2 className="post-info">
      posted by {username} at {date}
    </h2>
  );
}

function AuthorAvatar(src: string) {
  return <img className="author-avatar" src={src} alt="user avatar" />;
}

function AuthorInfo(elo: number, university: string) {
  return (
    <h3 className="author-info">
      Elo: {elo}
      <br />
      {university}
    </h3>
  );
}

function ForumPost() {
  return (
    <>
      <div className="forum-container">
        {/* <NavigationBar /> */}
        <div className="post">
          <div className="main-post">
            {PostTitle("Why is mathematics important in real life?")}
            {PostDescription(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec pur"
            )}
            {PostInfo("phuloi1512", "17:32 3/12/2024")}
          </div>
          <div className="post-author">
            {AuthorAvatar("https://www.w3schools.com/howto/img_avatar.png")}
            {AuthorInfo(3200, "University of Science, VNU-HCM")}
          </div>
        </div>
        <hr />
      </div>
    </>
  );
}

export default ForumPost;
