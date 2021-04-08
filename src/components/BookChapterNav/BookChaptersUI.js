import { useGlobal, useDispatch } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useImperativeHandle, useRef, useEffect, forwardRef } from "react";
import BookChapterLogic from "./BookChapterLogic";
import IconNumber from "components/IconNumber";
import { NavLink, useHistory } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// -- BookChapterNav ---------------------------------------------------- //
const BookChaptersUI = forwardRef((props, ref) => {
  const {
    isDynamic,
    debug,
    noMouse,
    startCollapsed,
    onRowClickCB,
    onActivateRow,
    onNavDisabled,
    onNavEnabled,
    onHomeClick,
    isExpanded,
    isEnabled
  } = props;

  const [chaptersData] = useGlobal("chaptersData");
  const itemEls = useRef([]);
  let history = useHistory();

  const navRef = useRef();
  const helper = useRef(); // ref is equivalent of instance prop

  let onRowClick = (url) => {
    if (!helper.current) return false;

    if (isDynamic) helper.current.disable(true);
    if (onRowClickCB) onRowClickCB();

    setImmediate(() => {
      history.push(url);
    });
  };

  useEffect(() => {
    if (!helper.current) {
      helper.current = new BookChapterLogic({
        el: navRef.current,
        rows: itemEls.current,
        isDynamic: isDynamic,
        expanded: !startCollapsed,
        noMouse: noMouse,
        onNavEnabled: onNavEnabled,
        onNavDisabled: onNavDisabled,
        onRowClick: onRowClick,
        onActivateRow: onActivateRow,
        isExpanded: isExpanded,
        isEnabled: isEnabled
      });
      helper.current.init();
    }
  }, []);

  useImperativeHandle(ref, () => {
    return {
      control: helper
    };
  });

  return (
    <nav
      tabIndex="0"
      className={`book-chapters ${debug ? "is-debug" : ""}`}
      ref={navRef}
      role="navigation"
      aria-label="Book index"
    >
      <div className="book-chapters__hitarea"></div>
      <ul>
        <li
          className="book-chapters__item chapter-row chapter-row--home "
          ref={(element) => (itemEls.current[0] = { slug: "home", el: element })}
        >
          <NavLink exact to={`/`} onClick={onHomeClick} aria-label={`Visit home`}>
            <div className="chapter-row__inner  ">
              <span className="chapter-row__nr js-nr"></span>
              <span className="chapter-row__title js-title">Home</span>
            </div>
            <div className="chapter-row__hover js-hover-area"></div>
          </NavLink>
        </li>
        {chaptersData.map((chapter, key) => (
          <li
            key={key}
            className="book-chapters__item chapter-row "
            ref={(element) => (itemEls.current[key + 1] = { slug: chapter.slug, el: element })}
          >
            <NavLink to={`/${chapter.slug}`} aria-label={`Visit chapter: ${chapter.title}`}>
              <div className="chapter-row__inner  ">
                <div className="chapter-row__line js-line"></div>
                <span className="chapter-row__nr js-nr">
                  <IconNumber nr={chapter.chapter_nr}></IconNumber>
                </span>
                <span className="chapter-row__title js-title">{chapter.title}</span>
              </div>
              <div className="chapter-row__hover js-hover-area"></div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
});

export default BookChaptersUI;
