import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//
import DialogueMoment from "./DialogueMoment";

gsap.registerPlugin(ScrollTrigger);

function Dialogue(props) {
  const { conversation } = props;
  const [revealList, setRevealList] = useState([0]);

  let onDialogueMomentReveal = (index) => {
    if (index < conversation.length - 1) {
      setRevealList([...revealList, index + 1]);
    }
  };

  return (
    <>
      <div className="dialogue">
        {conversation.map((content, index) => (
          <DialogueMoment
            key={index}
            dialogueIndex={index}
            participant={content.participant}
            dialogue={content.text}
            revealList={revealList}
            onRevealed={onDialogueMomentReveal}
          ></DialogueMoment>
        ))}
      </div>
    </>
  );
}

export default Dialogue;
