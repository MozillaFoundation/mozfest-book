import parse from "html-react-parser";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "reactn";
import Icon from "../Icon";

import Masonry from "masonry-layout";
import AuthorAvatar from "components/Author/AuthorAvatar";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ReactComponent as Title1 } from "../../assets/img/title-story-engine-quotes.svg";
import { ReactComponent as Title2 } from "../../assets/img/title-what-is-your-favorite-mozfest-memory.svg";
import { ReactComponent as Title3 } from "../../assets/img/title-what-makes-mozfest-different-from-other-events.svg";
import { ReactComponent as Title4 } from "../../assets/img/title-what-makes-you-want-to-come-back-to-mozfest.svg";

const Titles = {
  "story-engine-quotes": Title1,
  "what-is-your-favorite-mozfest-memory": Title2,
  "what-makes-mozfest-different-from-other-events": Title3,
  "what-makes-you-want-to-come-back-to-mozfest": Title4
};

gsap.registerPlugin(ScrollTrigger);

function ElementInterviews(props) {
  const [ready, setReady] = useState(false);

  const setBackgroundColor = useDispatch("setBackgroundColor");
  const resetBackgroundColor = useDispatch("resetBackgroundColor");

  const ref = useRef(null);
  const sectionRef = useRef(null);
  const masonryRef = useRef(null);
  const trigger = useRef(null);

  const isNotMobile = window.matchMedia("(min-width:600px)").matches;

  // little delay for the masonry init
  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 50);
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (ref.current) {
      if (isNotMobile) {
        masonryRef.current = new Masonry(ref.current, { percentPosition: true, initLayout: false });
        masonryRef.current.on("layoutComplete", (items) => {
          items.forEach((item) => {
            item.element.classList.remove("is-left");
            item.element.classList.remove("is-right");

            let position = item.position.x ? "right" : "left";
            item.element.classList.add("is-" + position);
          });
        });
        masonryRef.current.layout();
      } else {
        if (masonryRef.current) {
          masonryRef.current.destroy();
        }
      }

      // trigger for changing the background color
      trigger.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onEnter: (e) => {
          setBackgroundColor("pistache");
        },
        onLeave: (e) => {
          resetBackgroundColor();
        },
        onEnterBack: () => {
          setBackgroundColor("pistache");
        },
        onLeaveBack: () => {
          resetBackgroundColor();
        }
      });
    }

    return () => {
      if (trigger.current) trigger.current.kill(true);
      if (masonryRef.current) masonryRef.current.destroy();
      resetBackgroundColor();
    };
  }, [ref, ready, isNotMobile]);

  let renderTitle = (slug) => {
    const SvgTitle = Titles[slug];
    if (!SvgTitle) return null;
    return <SvgTitle></SvgTitle>;
  };

  return (
    <section className={`component component--interviews`} ref={sectionRef}>
      <div className="container">
        <div className="interviews-header">
          <span>{props.label}</span>
          <h2 className="sr-only">{props.title}</h2>
          <div className="interviews-header__title" aria-hidden="true">
            {renderTitle(props.slug)}
          </div>
        </div>
        <div
          className={`interviews-list interviews-list--${props.type === "interviews_short" ? "short" : "long"}`}
          ref={ref}
        >
          {props.items.map((item, index) => (
            <article className="interviews-list__item" key={index}>
              <Interview {...item}></Interview>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Interview(props) {
  const ref = useRef(null);
  const trigger = useRef(null);

  const hasImage = props.meta.image && props.meta.image.src;
  const nrOfWords = props.text.split(" ").length;
  const isShort = nrOfWords < 30;

  const baseStyle = {
    opacity: 0
  };

  useEffect(() => {
    trigger.current = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 80%",
      once: true,
      onEnter: (e) => {
        gsap.to(ref.current, { opacity: 1 });
      }
    });
  }, [ref]);

  return (
    <div
      className={`interview ${isShort ? "is-short" : ""} ${props.meta.margin ? "has-margin" : ""}`}
      ref={ref}
      style={baseStyle}
    >
      <div className="interview__meta">
        {hasImage && (
          <div className="interview__avatar">
            <AuthorAvatar {...props.meta.image} name={props.meta.name}></AuthorAvatar>
          </div>
        )}
        <div className="interview__author">
          {props.meta.name && <span>{props.meta.name}</span>}
          {props.meta.year && <span>{props.meta.year}</span>}
          {props.meta.position && <span>{props.meta.position}</span>}
        </div>
      </div>
      <div className="interview__body text">
        <aside>{parse(props.text)}</aside>
        {props.meta.link && (
          <a href={props.meta.link} className="btn interview__link" target="_blank" rel="noreferrer">
            <span>Read the full story</span>
            <Icon icon="arrow"></Icon>
          </a>
        )}
      </div>
    </div>
  );
}

export default ElementInterviews;
