import React from "react";

const Quote = ({ text, author }) => {
  return (
    <div className="quote-container">
      <blockquote>
        <p>{text}</p>
        <footer>- {author}</footer>
      </blockquote>
    </div>
  );
};

export default Quote;
