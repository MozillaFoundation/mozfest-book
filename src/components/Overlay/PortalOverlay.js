import { createPortal } from "react-dom";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Transition } from "react-transition-group";
import { setGlobal, useGlobal, useDispatch } from "reactn";
import Overlay from "./Overlay";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import useOnClickOutside from "use-onclickoutside";
import useKeypress from "hooks/useKeyPress";

const PortalOverlay2 = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    if (modalRoot) {
      modalRoot.appendChild(el.current);
    }
    return () => {
      if (modalRoot) modalRoot.removeChild(el.current);
    };
  }, [modalRoot]);

  return createPortal(children, el.current);
};

function PortalOverlay(props) {
  const { isVisible, doBlur, onCloseOverlay, slug } = props;
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [cursor, setCursor] = useGlobal("cursor");

  const activateBlur = useDispatch("blur");

  let onEnter = () => {
    let delay = 0;
    if (doBlur) {
      activateBlur("overlay-blur");
      delay = 0.25;
    }
    gsap.set(ref.current, { opacity: 0 });
    gsap.to(ref.current, { delay: delay, opacity: 1 });
  };
  let onExit = () => {
    if (doBlur) activateBlur(false);

    gsap.to(ref.current, { opacity: 0 });
  };

  // let handleClose = () => {
  //   // setCursor({ enabled: false });
  //   if (onCloseOverlay) {
  //     onCloseOverlay();
  //   }
  // };

  // useKeypress("Escape", handleClose);
  // useOnClickOutside(innerRef, handleClose);

  return (
    <PortalOverlay2>
      <Transition in={isVisible} onEnter={onEnter} onExit={onExit} mountOnEnter unmountOnExit timeout={500}>
        <div ref={ref}>
          <Overlay {...props}>{props.children}</Overlay>
        </div>
        {/* <div className={`overlay overlay--${slug}`} ref={ref}>
          <div className="container">
            <div className="overlay__inner" ref={innerRef}>
              <div className="overlay__close">
                <button onClick={handleClose}></button>
              </div>
              <div className="overlay__content">{props.children}</div>
            </div>
          </div>
        </div> */}
      </Transition>
    </PortalOverlay2>
  );
}

/*
<PortalOverlay>
        <div className="overlay-participant" onClick={lala}>
           <AuthorAvatar {...participant.image}></AuthorAvatar> 
  
          <h1>{participant.name}</h1>
          <p>{participant.text}</p>
        </div>
  </PortalOverlay> 

*/

export default PortalOverlay;
