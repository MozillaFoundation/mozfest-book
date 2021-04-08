import { useGlobal, useDispatch } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import { clearAllBodyScrollLocks } from "body-scroll-lock";
import Lottie from "react-lottie";
//
import { ReactComponent as ImgHowtoCommunity } from "../../assets/img/ill-outro.svg";
import Foreword from "./Foreword";
import OverlayWrapper from "components/Overlay/OverlayWrapper";
import animationData01 from "assets/lottie-animations/home-intro.json";
import HeaderLogo from "components/Header/HeaderLogo";
import OnBoardingMenu from "components/Home/OnBoardingMenu";

import MozfestFooter from "components/Footer/MozfestFooter";
import ParallaxLayer from "components/ParallaxLayer";

gsap.registerPlugin(ScrollTrigger);

function Home(props) {
  const { transitionFinished } = props;

  const headerRef = useRef(null);
  const lottieRef = useRef(null);

  const [showPreface, setShowPreface] = useState(false);
  const [titlePaused, setTitlePaused] = useState(true);
  const [initTimeout, setInitTimeout] = useState(false);
  const [transitionDone, setTransitionDone] = useState(false);

  const [bookColor, setBookColor] = useGlobal("bookColor");
  const [showChapterNav, setShowChapterNav] = useGlobal("showChapterNav");

  const disableHeaderBar = useDispatch("disableHeaderBar");

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData01,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  // perform some initial tasks
  useEffect(() => {
    setBookColor("white");
    setShowChapterNav(false);
    disableHeaderBar(true);

    return () => {
      clearAllBodyScrollLocks();
    };
  }, [disableHeaderBar, setBookColor, setShowChapterNav]);

  // a little workaround to get transitions state working smooth.
  useEffect(() => {
    if (!initTimeout) {
      setInitTimeout(true);
      return;
    }

    // check if transitionFinished is null or false if "null" there never was a transition initiated
    // if false we are waiting to finish, so its best to ignore false
    if (transitionFinished === null || transitionFinished) {
      setTransitionDone(true);
    }
  }, [initTimeout, transitionFinished]);

  // Intro animation
  useEffect(() => {
    let timeline = gsap.timeline();
    timeline
      .set(lottieRef.current.el, { opacity: 0 })
      .to(lottieRef.current.el, { opacity: 1, duration: 1, ease: "power4.inOut" }, 0.2)
      .add(() => {
        setTitlePaused(false);
      }, "-=0.8");
  }, []);

  return (
    <>
      <article className="home page">
        <div className="home-header is-blurrable" ref={headerRef}>
          <div className="container">
            <HeaderLogo
              listenToScroll={false}
              ignoreMediaQuery={true}
              animateOnMount={true}
              defaultCollapsed={true}
            ></HeaderLogo>
          </div>
        </div>
        <div className="home-block container home-block--howto is-blurrable">
          <h1 className="sr-only">How To MozFest: Arrive with an idea</h1>
          <div aria-hidden="true">
            <Lottie options={defaultOptions} isPaused={titlePaused} ref={lottieRef} />
          </div>
        </div>
        <div className="home-block home-block--quote container is-blurrable">
          <div className="home-block__inner">
            {/* Intro Quote */}
            <blockquote>
              <p>
                “At MozFest, people from across the globe — technologists from Nairobi, educators from Berlin — come
                together to build a healthier internet. We examine the most pressing issues online, like misinformation
                and the erosion of privacy. Then we roll up our sleeves to find solutions. In a way, MozFest is just the
                start: The ideas we bat around and the code we write always evolves into new campaigns and new
                open-source products.”
              </p>
              <cite>— Mark Surman</cite>
            </blockquote>
            <div className="home-block__button">
              <ParallaxLayer initDelay={250} offsetY={-100} minScreenWidth={0}>
                <button
                  className="card-button card-style"
                  title="Read more about Mozfest"
                  onClick={() => setShowPreface(true)}
                >
                  More about this project
                </button>
              </ParallaxLayer>
            </div>
          </div>
        </div>

        <OnBoardingMenu></OnBoardingMenu>

        <div className="home-block home-block--howto-community is-blurrable">
          <h1 className="sr-only">Leave with a community</h1>
          <div aria-hidden="true">
            <ImgHowtoCommunity></ImgHowtoCommunity>
          </div>
        </div>
      </article>
      <MozfestFooter></MozfestFooter>
      <div className="home-overlay">
        <OverlayWrapper
          isVisible={showPreface}
          onCloseOverlay={() => setShowPreface(false)}
          slug="preface"
          scrollable={true}
          ariaTitle="More about MozFest"
        >
          <Foreword />
        </OverlayWrapper>
      </div>
    </>
  );
}

export default Home;
