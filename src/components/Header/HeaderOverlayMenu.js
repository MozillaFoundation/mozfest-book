// import Example from "./Example";
import { Transition } from "react-transition-group";
import React, { useEffect, useRef } from "react";
import { useDispatch, useGlobal } from "reactn";
import gsap from "gsap/gsap-core";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

//
import Icon from "components/Icon";
import BookChaptersUI from "components/BookChapterNav/BookChaptersUI";

function HeaderOverlayMenu() {
  const [showMenu, setShowMenu] = useGlobal("showMobileOverlayMenu");
  const ref = useRef(null);
  const activateBlur = useDispatch("blur");
  const [darkModeEnabled] = useGlobal("darkMode");

  const toggleDarkMode = useDispatch("toggleDarkMode");

  let onClose = () => {
    setShowMenu(false);
  };

  let onEnter = () => {
    gsap.set(ref.current, { y: "0%", opacity: 0 });
    gsap.to(ref.current, { opacity: 1 });
  };

  let onExit = () => {
    gsap.to(ref.current, {
      opacity: 0,
      onComplete: () => {
        gsap.set(ref.current, { y: "-150%", opacity: 0 });
      }
    });
  };

  useEffect(() => {
    gsap.set(ref.current, { y: "-150%", opacity: 0 });
  }, []);

  useEffect(() => {
    if (showMenu) {
      ref.current.scrollTo(0, 0);
      activateBlur("menu-blur");
      disableBodyScroll(ref.current);
    } else {
      activateBlur();
      clearAllBodyScrollLocks();
    }
  }, [showMenu, activateBlur]);

  let onClickRow = () => {
    onClose();
  };

  return (
    <Transition in={showMenu} onEnter={onEnter} onExit={onExit} timeout={0}>
      <div className="overlay-menu" ref={ref} aria-hidden={!showMenu}>
        <div className="overlay-menu__header container">
          <button onClick={onClose}>
            <Icon icon="close"></Icon>
          </button>
        </div>
        <div className="overlay-menu__nav">
          <BookChaptersUI
            isDynamic={false}
            isEnabled={true}
            isExpanded={true}
            onRowClickCB={onClickRow}
          ></BookChaptersUI>
        </div>
        <div className="overlay-menu__footer container">
          <button className="icon-link" onClick={() => toggleDarkMode(!darkModeEnabled)}>
            <span>Switch to {`darkmode`}</span>
            <Icon icon="darkmode"></Icon>
          </button>
        </div>
      </div>
    </Transition>
  );
}

export default HeaderOverlayMenu;
