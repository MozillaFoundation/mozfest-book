import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import parse from "html-react-parser";
//
import Icon from "../Icon";
import useTransitionDoneEvent from "hooks/useTransitionDoneEvent";

gsap.registerPlugin(ScrollTrigger);

function ElementBullets(props) {
  const { bullets } = props;
  const ref = useRef(null);
  const isTransitionDone = useTransitionDoneEvent();

  useEffect(() => {
    if (!isTransitionDone) return;
    const bullets = ref.current.querySelectorAll("li");
    let triggers = [];

    bullets.forEach((element) => {
      let trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 70%",
        onToggle: (e) => {
          if (e.isActive) {
            e.trigger.classList.add("is-active");
          } else {
            e.trigger.classList.remove("is-active");
          }
        }
      });

      triggers.push(trigger);
    });

    // kill
    return () => {
      triggers.forEach((trigger) => {
        trigger.kill(true);
      });
    };
  }, [isTransitionDone]);

  return (
    <div className="component component--bullets container">
      <ul className="bullets-hands" ref={ref}>
        {bullets.map((bullet, index) => (
          <li key={index}>
            <Icon icon="hand" role="presentation"></Icon>
            <div>{parse(bullet)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ElementBullets;
