import parse from "html-react-parser";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { uniqueId } from "lodash-es";

gsap.registerPlugin(ScrollToPlugin);

function ElementStory(props) {
  const [expanded, setExpanded] = useState(false);
  const firstLoad = useRef(true);
  let onClick = () => {
    setExpanded(!expanded);
  };
  const refBody = useRef();
  const ariaId = useRef(false);

  if (!ariaId.current) {
    ariaId.current = uniqueId("aria-story-");
  }

  let getLabel = () => {
    if (expanded) {
      return "Close";
    } else {
      return "Read more";
    }
  };

  useEffect(() => {
    if (expanded) {
      gsap.to(refBody.current, {
        height: refBody.current.scrollHeight,
        onComplete: () => {
          ScrollTrigger.refresh();
          refBody.current.firstElementChild.focus();
        }
      });
    } else {
      if (!firstLoad.current) {
        var rect = refBody.current.getBoundingClientRect();
        var offsetTop = window.pageYOffset - rect.height;
        // scroll back up to prevent triggering anything else
        gsap.to(window, {
          scrollTo: { y: offsetTop }
        });
      }

      gsap.to(refBody.current, {
        height: "0px",
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
    }

    firstLoad.current = false;
  }, [expanded]);

  return (
    <section className="component component--story container">
      <article className={`inline-story ${expanded ? "is-expanded" : ""}`}>
        <header>
          <h2>{props.title}</h2>
          <h3>{props.intro}</h3>
        </header>
        <div
          id={ariaId.current}
          className="inline-story__body"
          ref={refBody}
          aria-expanded={expanded}
          aria-hidden={!expanded}
          tabIndex="-1"
        >
          <div className="text">{parse(props.text)}</div>
        </div>
        <footer>
          <button onClick={onClick} aria-controls={ariaId.current}>
            {getLabel()}
          </button>
        </footer>
      </article>
    </section>
  );
}

export default ElementStory;
