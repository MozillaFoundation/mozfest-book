import "./styles/main.scss";
import {} from "./globalState";
import { Transition, SwitchTransition } from "react-transition-group";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useState } from "react";
import { BrowserRouter as Router, Switch, matchPath, Route, useLocation } from "react-router-dom";
import { useGlobal, useEffect, useRef, useDispatch } from "reactn";
import { Provider as BusProvider, useBus, useListener } from "react-bus";
import ReactGA from "react-ga";

//
import HeaderBar from "./components/Header/HeaderBar";
import BookChapterNav from "./components/BookChapterNav/BookChapterNav";
import Cursor from "./components/Cursor";
import Chapter from "./components/Chapter/Chapter";
import Home from "./components/Home/";
import HeaderOverlayMenu from "./components/Header/HeaderOverlayMenu";
import AuthorsManager from "components/Author/AuthorsManager";
import AriaStatus from "components/AriaStatus";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

/**
 * Set the current chapter on location change
 */
function LocationHandler() {
  const location = useLocation();
  const [currentChapter, setCurrentChapter] = useGlobal("currentChapter");

  useEffect(() => {
    let isChapter = matchPath(location.pathname, {
      path: "/:chapter"
    });

    if (!isChapter) {
      setCurrentChapter({});
    }
  }, [location.pathname, setCurrentChapter]);

  return null;
}

// -- Google Tracking ------------------------------------------------------------------
function GoogleTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!process.env.REACT_APP_GA_TRACKING) return;
    ReactGA.initialize("UA-87658599-23");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location]);

  return null;
}

// -- App -------------------------------------------------------------------------------
function App() {
  const [darkModeEnabled] = useGlobal("darkMode");
  const [blur] = useGlobal("blur");
  const [bookColor] = useGlobal("bookColor");
  const [chaptersData] = useGlobal("chaptersData");
  const [contentBackgroundColor] = useGlobal("backgroundColor");

  const fetchData = useDispatch("fetchData");
  const [chapterHasScrolled, setChapterHasScrolled] = useGlobal("chapterScrolled");

  // load the data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    document.documentElement.setAttribute("data-has-background-color", !chapterHasScrolled);
  }, [chapterHasScrolled]);

  useEffect(() => {
    document.documentElement.setAttribute("data-darkmode", darkModeEnabled);
  }, [darkModeEnabled]);

  // the blurring in this website is mostly handled in CSS because there are a couple
  // of different blurring styles
  useEffect(() => {
    if (!blur) {
      document.documentElement.removeAttribute("data-blur");
    } else {
      document.documentElement.setAttribute("data-blur", blur);
    }
  }, [blur]);

  useEffect(() => {
    var styles = [];

    if (bookColor) {
      styles.push(`--theme-color:var(--color-${bookColor})`);
    }

    if (contentBackgroundColor) {
      styles.push(`--content-background-color:var(--color-${contentBackgroundColor})`);
    }

    document.documentElement.setAttribute("style", styles.join(";"));
  }, [bookColor, contentBackgroundColor]);

  useEffect(() => {
    if (contentBackgroundColor) {
      document.documentElement.setAttribute("data-has-content-background-color", true);
    } else {
      document.documentElement.setAttribute("data-has-content-background-color", false);
    }
  }, [contentBackgroundColor]);

  return (
    <>
      <BusProvider>
        <div className="App">
          {chaptersData && chaptersData.length > 0 && (
            <Router>
              <Main></Main>
            </Router>
          )}
          <Cursor></Cursor>
        </div>
      </BusProvider>
    </>
  );
}

export default App;

// -- Main -------------------------------------------------------------------------------
function Main(props) {
  const [showChapterNav, setShowChapterNav] = useGlobal("showChapterNav");

  const [transitionDone, setTransitionDone] = useState(null);

  const nodeRef = useRef(null);
  const promiseRef = useRef(Promise.resolve(true));

  let location = useLocation();

  const isChapterLocation = matchPath(location.pathname, {
    path: "/:chapterSlug/:pageSlug?",
    strict: false
  });

  // onEnter transitions
  let onEnter = (node) => {
    setTransitionDone(false);

    let chapterTransition = (node) => {
      return new Promise((resolve, reject) => {
        node.style.opacity = 0;
        node.style.position = "absolute";

        gsap.set(node, {
          zIndex: 1,
          width: "100%",
          y: `${window.innerHeight}px`,
          top: `${window.scrollY}px`,
          opacity: 1
        });

        gsap.to(node, {
          y: "0px",
          delay: 0.1,
          duration: 0.4,
          onComplete: () => {
            window.scrollTo(0, 0);
            gsap.set(node, { clearProps: "zIndex,y,top,position" });
            resolve("enter");
          }
        });
      });
    };

    let homeTransition = (node) => {
      return new Promise((resolve, reject) => {
        gsap.set(node, { opacity: 0 });
        gsap.to(node, {
          opacity: 1,
          onComplete: () => {
            window.scrollTo(0, 0);
            resolve("enter");
          }
        });
      });
    };

    if (isChapterLocation) {
      promiseRef.current = chapterTransition(node);
    } else {
      promiseRef.current = homeTransition(node);
    }
  };

  let onExit = (node) => {
    promiseRef.current = new Promise((resolve, reject) => {
      resolve();
    });
  };

  let endListener = (node, done) => {
    promiseRef.current
      .then((type) => {
        if (type === "enter") {
          // added a little timeout, without the timeout
          // there were some issues with scrollTriggers
          setImmediate(() => {
            setTransitionDone(true);
            ScrollTrigger.refresh();
          });
        }
        return;
      })
      .then(done);
  };

  return (
    <>
      <a href="#page-main" className="skip">
        Skip to main content
      </a>
      <AriaStatus></AriaStatus>
      <GoogleTracking />
      <LocationHandler />
      <header className="app-header">
        <HeaderOverlayMenu></HeaderOverlayMenu>
        {showChapterNav && <BookChapterNav></BookChapterNav>}
        {isChapterLocation && <HeaderBar></HeaderBar>}
      </header>
      <main>
        <SwitchTransition mode="in-out">
          <Transition key={isChapterLocation} onEnter={onEnter} onExit={onExit} addEndListener={endListener}>
            <div className="page-container" ref={nodeRef}>
              <Switch location={location}>
                <Route path={`/:chapterSlug/:pageSlug?`}>
                  <Chapter transitionFinished={transitionDone} />
                </Route>
                <Route path={`/`}>
                  <Home transitionFinished={transitionDone} />
                </Route>
              </Switch>
            </div>
          </Transition>
        </SwitchTransition>
      </main>
      <AuthorsManager></AuthorsManager>
      <div id="modal-root" className="modal-root"></div>
    </>
  );
}
