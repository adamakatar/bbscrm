import React from "react";

const ShowMoreShowLessText = ({ text, visibility = 30 }) => {
  const [isshowingMore, setIsShowingMore] = React.useState(false);

  return (
    <>
      {text?.substring(0, isshowingMore ? text.length : visibility)}
      {text?.length > visibility && !isshowingMore && "..."}{" "}
      {text?.length > visibility && (
        <span
          onClick={() => setIsShowingMore((p) => !p)}
          style={{
            color: "#009ce5",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {" "}
          {isshowingMore ? "Show Less" : "Show More"}
        </span>
      )}
    </>
  );
};

export default ShowMoreShowLessText;
