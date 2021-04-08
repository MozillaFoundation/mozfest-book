import React, { useEffect, useRef } from "react";
import { useGlobal, useDispatch } from "reactn"; // <-- reactn
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useHistory } from "react-router-dom";
import gsap from "gsap/gsap-core";
import useOnClickOutside from "use-onclickoutside";

//
import useKeypress from "../../hooks/useKeyPress";
import Icon from "../Icon";
import ScrollProgress from "./ScrollProgress";

// ------------------------------------------------------------------------------------------------ //
function IndexPanel(props) {
  let { index, chapter, activeSubChapter, url } = props;
  let hasIndex = index.length > 1;
  let history = useHistory();
  const [chapterIndexOpen, setChapterIndexOpen] = useGlobal("chapterIndexOpen");
  const [scrollToPage, setScrollToPage] = useGlobal("scrollToPage");
  const activateBlur = useDispatch("blur");
  const isNotMobile = window.matchMedia("(min-width:600px)").matches;

  const panelRef = useRef(null);
  const panelLayerRef = useRef(null);
  const transitionRef = useRef(null);

  const subChapter = getSubChapter();

  useKeypress("Escape", hideOverlay);
  useOnClickOutside(panelRef, hideOverlay);

  if (activeSubChapter) {
    transitionRef.current = activeSubChapter;
  } else {
    transitionRef.current = chapter.slug;
  }

  function getSubChapter() {
    if (!chapter.index) return;
    let subChapterObj = chapter.index.find((o) => o.slug === activeSubChapter);
    return subChapterObj;
  }

  function hideOverlay() {
    if (!chapterIndexOpen) return;

    // setBookBlur(false);
    setChapterIndexOpen(false);

    setTimeout(() => {
      activateBlur(false);
    }, 150);
  }

  function showOverlay() {
    if (chapterIndexOpen) return;

    activateBlur("index-blur");
    setTimeout(() => {
      setChapterIndexOpen(true);
    }, 150);
  }

  function onToggleOverlay() {
    if (!hasIndex) return;

    if (!chapterIndexOpen) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }

  function isActive(section) {
    return section.slug === activeSubChapter;
  }

  function onItemClick(sectionSlug) {
    // need to migrate this somewhere else

    hideOverlay();

    let clickedPage = chapter.pages.find((o) => o.slug === sectionSlug);
    // determine if the user clicked on a page which is also the first page of a chapter
    let isFirstPageClicked = chapter.pages.indexOf(clickedPage) === 0;
    // determine if the user clicked on a page which is already active
    let isCurrentPageClicked = activeSubChapter && sectionSlug === activeSubChapter;

    setTimeout(() => {
      // scroll to the page
      if (isCurrentPageClicked || (!activeSubChapter && isFirstPageClicked)) {
        setScrollToPage(sectionSlug);
        return;
      }
      history.push(`/${chapter.slug}/${sectionSlug}`);
    }, 600);
  }

  useEffect(() => {
    if (chapterIndexOpen) {
      if (isNotMobile) disableBodyScroll(panelRef.current);

      let navItems = panelLayerRef.current.querySelectorAll("li");
      gsap.set(navItems, { opacity: 1 });
      gsap.set(panelLayerRef.current, { opacity: 0, y: "-50px" });
      gsap.to(panelLayerRef.current, { duration: 0.2, opacity: 1, y: "0px" });
    } else {
      gsap.to(panelLayerRef.current, {
        duration: 0.2,
        y: "-50px",
        opacity: 0,
        onComplete: () => {
          gsap.set(panelLayerRef.current, { opacity: 0, y: "-99999px" });
          if (isNotMobile) enableBodyScroll(panelRef.current);
        }
      });
    }

    return () => {
      if (isNotMobile) clearAllBodyScrollLocks();
    };
  }, [chapterIndexOpen, isNotMobile]);

  let getIndexTitle = () => {
    let nr = false;
    let title = false;

    if (chapter) {
      nr = chapter.chapter_nr;
      title = chapter.title;
    }

    if (subChapter) {
      title = `${subChapter.index}: ${subChapter.title}`;
    }

    return {
      nr: nr,
      title: title
    };
  };

  const indexTitle = getIndexTitle();
  return (
    <div className="index-panel" ref={panelRef}>
      <div
        className="index-panel__trigger index-trigger"
        onClick={onToggleOverlay}
        aria-label="Chapter index"
        aria-expanded={chapterIndexOpen}
        aria-haspopup={true}
        aria-controls="aria-index-panel"
        role="button"
      >
        <TransitionGroup className="index-trigger__current">
          <CSSTransition
            key={transitionRef.current}
            mountOnEnter
            unmountOnExit
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames="item"
            aria-hidden="true"
          >
            <div className="index-trigger__wrapper">
              <div className="index-trigger__chapter-nr">{indexTitle.nr}</div>
              <div className="index-trigger__chapter-title">{indexTitle.title}</div>
            </div>
          </CSSTransition>
        </TransitionGroup>
        <div className="index-trigger__progress">
          <ScrollProgress></ScrollProgress>
        </div>
        {index.length > 1 && (
          <TransitionGroup className="index-trigger__toggle">
            <CSSTransition
              key={chapterIndexOpen}
              mountOnEnter
              unmountOnExit
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="item"
            >
              <button className={`toggle-button ${chapterIndexOpen ? "is-enabled" : ""}`}>
                <span>{chapterIndexOpen ? "Close" : "Show all"}</span>
                <Icon icon="arrow-down"></Icon>
              </button>
            </CSSTransition>
          </TransitionGroup>
        )}
      </div>
      <div className={`index-panel__layer ${chapterIndexOpen ? "is-visible" : ""}`} ref={panelLayerRef}>
        <ul
          className={`index-panel__list `}
          tabIndex="0"
          role="menu"
          id="aria-index-panel"
          aria-hidden={!chapterIndexOpen}
        >
          {hasIndex && (
            <>
              {index.map((section, index) => (
                <ListItem
                  key={index}
                  index={section.index}
                  title={section.title}
                  slug={section.slug}
                  isActive={isActive(section)}
                  onItemClick={onItemClick}
                ></ListItem>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default IndexPanel;

// ------------------------------------------------------------------------------------------------ //
function ListItem(props) {
  const { index, title, slug, isActive, onItemClick } = props;

  let onClick = () => {
    onItemClick(slug);
  };

  return (
    <li role="none" className={`${isActive ? "is-active" : ""}`}>
      <button onClick={onClick} role="menuitem" aria-current={isActive}>
        <Icon icon="hand"></Icon>
        <div>
          <span>{index}</span>
          <h3>{title}</h3>
        </div>
      </button>
    </li>
  );
}
