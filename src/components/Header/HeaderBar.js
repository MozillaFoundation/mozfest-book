import React, { useState, useEffect, useRef } from "react";
import { useGlobal, useDispatch } from "reactn";
import { useHistory } from "react-router-dom";
import gsap from "gsap/gsap-core";

//
import HeaderLogo from "./HeaderLogo";
import IndexPanel from "components/IndexPanel/IndexPanel";
import Icon from "../Icon";
import { ReactComponent as IconLogoBox } from "assets/icon-m-logo-box.svg";

function HeaderBar(props) {
  const [headerBarState] = useGlobal("headerBar");
  const [currentChapter] = useGlobal("currentChapter");
  const [currentSubChapter] = useGlobal("currentSubChapter");
  const [showMenu, setShowMenu] = useGlobal("showMobileOverlayMenu");
  const [darkModeEnabled] = useGlobal("darkMode");
  const [headerHideBg, setHeaderHideBg] = useGlobal("headerHideBg");
  const [headerResetBg, setHeaderResetBg] = useGlobal("headerResetBg");
  const [chapterIndexOpen, setChapterIndexOpen] = useGlobal("chapterIndexOpen");

  const [index, setIndex] = useState([]);

  const toggleDarkMode = useDispatch("toggleDarkMode");
  const toggleHeaderBar = useDispatch("toggleHeaderBar");

  const { visible, disabled } = headerBarState;

  const headerRef = useRef(false);

  let history = useHistory();
  let revealTimeline = useRef();

  let onBurgerClick = () => {
    setShowMenu(true);
  };

  let gotoHome = () => {
    history.push(`/`);
  };

  let onDarkModeClick = () => {
    toggleDarkMode(!darkModeEnabled);
  };

  useEffect(() => {
    if (revealTimeline.current) {
      revealTimeline.current.paused();
    }

    if (!revealTimeline.current) {
      revealTimeline.current = gsap.timeline();
    }

    if (!visible) {
      revealTimeline.current
        .to(headerRef.current, {
          y: "-100%",
          duration: 0.2
        })
        .add(() => {
          gsap.set(headerRef.current, { opacity: 0 });
        });
    } else {
      revealTimeline.current.set(headerRef.current, { y: "-100%", opacity: 1 }).to(headerRef.current, {
        y: "0%",
        duration: 0.2
      });
    }
  }, [visible]);

  useEffect(() => {
    let index = currentChapter.index || [];
    setIndex(index);
  }, [currentChapter, currentSubChapter]);

  return (
    <div
      className={`header-bar ${chapterIndexOpen ? "index-open" : ""} ${headerResetBg ? "reset-bg" : ""} ${
        headerHideBg ? "hide-bg" : ""
      }`}
      ref={headerRef}
      style={{ transform: "translateY(-100%)", opacity: "0" }}
    >
      <div className="header-bar__backdrop"></div>

      <div className="header-bar__inner container">
        <div className="header-bar__top">
          <div className="header-bar__logo" onClick={gotoHome}>
            <HeaderLogo listenToScroll={true}></HeaderLogo>
            <div className="header-logo--small">
              <IconLogoBox></IconLogoBox>
            </div>
          </div>
          <div className="header-bar__actions">
            <button title="toggle darkmode" aria-label={`Toggle darkmode`} onClick={onDarkModeClick}>
              <Icon icon="darkmode"></Icon>
            </button>
          </div>
          <div className="header-bar__burger">
            <button onClick={onBurgerClick} aria-label={`Expand menu`}>
              <Icon icon="burger"></Icon>
            </button>
          </div>
        </div>
        <div className="header-bar__index">
          <IndexPanel index={index} activeSubChapter={currentSubChapter} chapter={currentChapter}></IndexPanel>
        </div>
      </div>
    </div>
  );
}
export default HeaderBar;
