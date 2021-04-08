/**
 * Uses BookChaptersUI to generate the main nav interface
 */
import { useGlobal, useDispatch } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//
import { ReactComponent as IconClose } from "assets/icon-close-large.svg";
import BookChaptersUI from "./BookChaptersUI";

gsap.registerPlugin(ScrollTrigger);

// -- BookChapterNav ---------------------------------------------------- //
function BookChapterNav(props) {
  const { debug } = props;
  const activateBlur = useDispatch("blur");
  const [chapterNavEnabled, setChapterNavEnabled] = useGlobal("chapterNavEnabled");
  const chaptersUIRef = useRef();
  const navEnabled = useRef();

  let onNavEnabled = () => {
    navEnabled.current = true;
    setChapterNavEnabled(true);
    activateBlur("menu-blur");
  };

  let onNavDisabled = () => {
    navEnabled.current = false;
    setTimeout(() => {
      setChapterNavEnabled(false);
    }, 500);
    activateBlur();
  };

  let handleClose = () => {
    chaptersUIRef.current.control.current.disable();
  };

  return (
    <div className={`book-chapters-nav ${navEnabled.current ? "is-enabled" : ""}`}>
      <BookChaptersUI
        debug={debug}
        ref={chaptersUIRef}
        isDynamic={true}
        onNavDisabled={onNavDisabled}
        onNavEnabled={onNavEnabled}
      ></BookChaptersUI>
      <div className="book-chapters-nav__close">
        <button onClick={handleClose}>
          <IconClose></IconClose>
        </button>
      </div>
    </div>
  );
}

export default BookChapterNav;
