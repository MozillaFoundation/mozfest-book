import { useRef, useEffect, useState } from "react";
import { useGlobal, useDispatch } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AuthorAvatar from "components/Author/AuthorAvatar";
import DialogueParagraph from "./DialogueParagraph";
import { ReactComponent as IconArrowSmall } from "assets/icon-arrow-small.svg";
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";

gsap.registerPlugin(ScrollTrigger);

function DialogueMoment(props) {
  const { participant, onRevealed, dialogue, dialogueIndex, revealList } = props;
  const [authors] = useGlobal("authors");

  const [reveal, setReveal] = useState(false);
  const [paragraphRevealList, setParagraphRevealList] = useState([]);
  const dialogueRef = useRef(null);
  const mainTrigger = useRef();
  const isMounted = useRef();

  const showAuthorDispatch = useDispatch("showAuthor");

  const author = getAuthor(participant);

  const isTransitionDone = useTransitionDoneEvent();

  function onClick() {
    showAuthorDispatch(author.id);
  }

  function getAuthor(id) {
    let author = authors.find((o) => o.id === id);
    return author ? author : {};
  }

  function hideDialogue() {
    gsap.set([dialogueRef.current], { opacity: 0 });
    gsap.set(dialogueRef.current, { y: "10px" });
  }

  function revealDialogue() {
    gsap.to(dialogueRef.current, {
      opacity: 1,
      y: "0px"
    });
  }

  //
  useEffect(() => {
    hideDialogue();
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isTransitionDone) return;
    if (reveal) return;
    let readyToReveal = revealList.indexOf(dialogueIndex) > -1;
    if (readyToReveal) {
      setReveal(true);
      setParagraphRevealList([0]);
    }
  }, [isTransitionDone, revealList, reveal, dialogueIndex]);

  // listen for page scrolling
  useEffect(() => {
    if (!reveal) return;

    // main trigger
    mainTrigger.current = ScrollTrigger.create({
      trigger: dialogueRef.current,
      start: "top 90%",
      onEnter: () => {
        if (reveal) {
          revealDialogue();
        }
      }
    });

    return () => {
      if (mainTrigger.current) mainTrigger.current.kill(true);
    };
  }, [reveal]);

  // keep track of the revealed paragraphs, as soon as all paragraphs are
  // revealed we notify the dialogue and state that this part is done.
  // This triggers the loading of the next paragraph
  let onParagraphReveal = (index) => {
    if (!isMounted.current) return;
    if (index < dialogue.length - 1) {
      // paragraph reveal, reveal next paragraph
      setParagraphRevealList([...paragraphRevealList, index + 1]);
    } else {
      onRevealed(dialogueIndex);
    }
  };

  return (
    <div className="dialogue-moment is-loading" ref={dialogueRef} aria-label={`${author.name} says`}>
      <div className="dialogue-moment__author">
        <button className="dialogue-moment__avatar" onClick={onClick} aria-label={`Visit bio of ${author.name}`}>
          <AuthorAvatar name={author.name} {...author.image}></AuthorAvatar>
          <div className="dialogue-moment__avatar-label">
            <IconArrowSmall></IconArrowSmall>
            <span>About</span>
          </div>
        </button>
      </div>
      <div className="dialogue-moment__body">
        <div className="dialogue-moment__text">
          {dialogue.map((paragraph, index) => (
            <DialogueParagraph
              key={index}
              text={paragraph}
              reveal={paragraphRevealList.indexOf(index) > -1}
              paragraphId={index}
              onRevealed={onParagraphReveal}
            ></DialogueParagraph>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DialogueMoment;
