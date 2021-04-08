import { gsap } from "gsap";
import { useRef, useEffect, useState } from "react";
import IconNumber from "../IconNumber";
import Lottie from "react-lottie";
//
import Icon from "../Icon";
import animationData01 from "../../assets/lottie-animations/chapter-01.json";
import animationData02 from "../../assets/lottie-animations/chapter-02.json";
import animationData03 from "../../assets/lottie-animations/chapter-03.json";
import animationData04 from "../../assets/lottie-animations/chapter-04.json";
import animationData05 from "../../assets/lottie-animations/chapter-05.json";
import animationData06 from "../../assets/lottie-animations/chapter-06.json";

const Titles = {
  "01": animationData01,
  "02": animationData02,
  "03": animationData03,
  "04": animationData04,
  "05": animationData05,
  "06": animationData06
};

function ChapterTitle(props) {
  const { chapter } = props;

  const refNr = useRef(null);
  const [titlePaused, setTitlePaused] = useState(true);

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: Titles[chapter.chapter_nr],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  // Intro animation
  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    timeline.to(refNr.current, { scale: 1, delay: 0.3 }).add(() => {
      setTitlePaused(false);
    }, "-=0.2");
    timeline.play();

    return () => {
      if (timeline) timeline.kill(true);
    };
  }, []);

  return (
    <div className="chapter-page__splash container">
      <h1 className="sr-only">
        {chapter.chapter_nr} {chapter.title}
      </h1>

      <div className="chapter-page__number" ref={refNr} aria-hidden="true">
        <IconNumber nr={chapter.chapter_nr}></IconNumber>
      </div>

      <div className="chapter-page__title" aria-hidden="true">
        <Lottie options={defaultOptions} isPaused={titlePaused} />
      </div>
      {chapter.download && (
        <a
          href={chapter.download}
          className="button-icon button-icon--download"
          target="_blank"
          rel="noreferrer"
          download
        >
          Download this chapter
          <Icon icon="download"></Icon>
        </a>
      )}
    </div>
  );
}
export default ChapterTitle;
