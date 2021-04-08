import { setGlobal, useGlobal, useDispatch } from "reactn";
import { gsap } from "gsap";
import { useRef, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import Overlay from "./Overlay";
import { Provider as BusProvider, useBus, useListener } from "react-bus";

function OverlayWrapper(props) {
  const { isVisible, ariaTitle } = props;
  const ref = useRef(null);
  const activateBlur = useDispatch("blur");
  const bus = useBus();

  let onEnter = () => {
    gsap.set(ref.current, { opacity: 0 });
    gsap.to(ref.current, {
      delay: 0.3,
      opacity: 1,
      onComplete: () => {
        bus.emit("transitionDone", true);
      }
    });
  };

  let onExit = () => {
    gsap.to(ref.current, {
      opacity: 0
    });
  };

  useEffect(() => {
    if (isVisible) {
      activateBlur("preface-blur");
    } else {
      activateBlur(false);
    }

    return () => {
      activateBlur(false);
    };
  }, [isVisible]);

  return (
    <Transition in={isVisible} mountOnEnter unmountOnExit onEnter={onEnter} onExit={onExit} timeout={1000}>
      <div ref={ref}>
        <Overlay {...props}>{props.children}</Overlay>
      </div>
    </Transition>
  );
}

export default OverlayWrapper;
