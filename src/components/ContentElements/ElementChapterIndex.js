import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHistory } from "react-router-dom";
import { uniqueId } from "lodash-es";
import parse from "html-react-parser";

//
import { ReactComponent as NumberGo } from "assets/number-go.svg";
import IconNumber from "../IconNumber";
import GetParentScrollContainer from "../../common/GetParentScrollContainer";

// import GetParentScrollContainer from "./"
gsap.registerPlugin(ScrollTrigger);

function Row(props) {
  const { url, text, index } = props;
  const ref = useRef(null);
  let history = useHistory();

  const buttonRef = useRef(null);
  const textRef = useRef(null);
  const ariaDescribeId = uniqueId("aria-describe-");

  let reveal = () => {
    gsap.set(buttonRef.current, { scale: 0, opacity: 1 });
    gsap.set(textRef.current, { y: "50px" });

    gsap.to(buttonRef.current, { scale: 1, ease: "back.out(1.7)" });
    gsap.to(textRef.current, { y: 0, opacity: 1 });
  };

  let gotoChapter = (ev) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    history.push(url);
  };

  useEffect(() => {
    gsap.set([buttonRef.current, textRef.current], { opacity: 0 });

    let trigger;
    let scrollContainer = GetParentScrollContainer(ref.current);

    // trigger if the timeline comes into view
    trigger = ScrollTrigger.create({
      scroller: scrollContainer,
      trigger: ref.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        reveal();
      }
    });

    return () => {
      if (trigger) trigger.kill(true);
    };
  }, []);

  return (
    <a
      href={url}
      onClick={gotoChapter}
      className="chapter-index__item"
      aria-label={`Visit chapter ${index + 1}`}
      aria-describedby={ariaDescribeId}
      ref={ref}
    >
      <button className="chapter-index__button" onClick={gotoChapter} ref={buttonRef}>
        <div role="presentation" className="chapter-index__nr">
          <IconNumber nr={`0${index + 1}`}></IconNumber>
        </div>
        <div className="chapter-index__go">
          <NumberGo></NumberGo>
        </div>
      </button>
      <div id={ariaDescribeId} className="chapter-index__text" ref={textRef}>
        {parse(text)}
      </div>
    </a>
  );
}

function ElementChapterIndex(props) {
  const { rows } = props;
  return (
    <section className="component component--chapter-index container">
      <ul className="chapter-index">
        {rows.map((row, index) => (
          <Row key={index} index={index} {...row}></Row>
        ))}
      </ul>
    </section>
  );
}

export default ElementChapterIndex;
