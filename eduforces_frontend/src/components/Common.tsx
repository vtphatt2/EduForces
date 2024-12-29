const baseUrl = "http://localhost:8080/api/v1";
const getAccountDetailById = async (id: string) => {
  try {
    const response = await fetch(`${baseUrl}/accounts/account-details/${id}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("session_id") || "",
      },
    });

    if (!response.ok) {
      throw new Error(`Cannot fetch account details: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    alert(`Error: ${error}`);
    return null;
  }
};

const formatTimestamp = (timestamp: string) => {
  const dat = new Date(timestamp);
  const date = new Date(dat.getTime() - 7 * 60 * 60 * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute} ${day}/${month}/${year}`;
};

const getTrueImageSrc = (src: string) => {
  if (src.startsWith("http")) {
    return src;
  }
  return "http://localhost:8080/" + src;
};

export { formatTimestamp, getTrueImageSrc };
export default getAccountDetailById;
