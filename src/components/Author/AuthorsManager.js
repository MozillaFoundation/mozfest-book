/**
 * The AuthorsManager is responsible for showing the AuthorOverlay based on
 * a state value
 */
import React, { useState } from "react";

import { useGlobal, useEffect, useDispatch } from "reactn";
import AuthorOverlay from "./AuthorOverlay";

function AuthorsManager(props) {
  const [showAuthor] = useGlobal("showAuthor");
  const [authors] = useGlobal("authors");
  const [visible, setVisible] = useState(false);
  const [author, setAuthor] = useState({});
  const showAuthorDispatch = useDispatch("showAuthor");

  let onCloseOverlay = () => {
    setVisible(false);
    showAuthorDispatch(false);
  };

  useEffect(() => {
    let getAuthor = (id) => {
      let author = authors.find((o) => o.id === id);
      return author ? author : {};
    };

    if (showAuthor) {
      setAuthor(getAuthor(showAuthor));
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [showAuthor, authors]);

  return <AuthorOverlay isVisible={visible} participant={author} onCloseOverlay={onCloseOverlay}></AuthorOverlay>;
}

export default AuthorsManager;
