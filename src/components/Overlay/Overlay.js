import { useRef, useEffect } from "react";
import { useGlobal, useDispatch } from "reactn";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import useOnClickOutside from "use-onclickoutside";
import useKeypress from "hooks/useKeyPress";
import { ReactComponent as IconClose } from "assets/icon-close-large.svg";

function Overlay(props) {
  const { isVisible, doBlur, onCloseOverlay, slug, children, scrollable, ariaTitle } = props;
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [cursor, setCursor] = useGlobal("cursor");

  const activateBlur = useDispatch("blur");

  useEffect(() => {
    return () => {
      activateBlur(false);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      disableBodyScroll(ref.current);
    } else {
      setCursor({ enabled: false });
      clearAllBodyScrollLocks();
    }
  }, [isVisible]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);

  useEffect(() => {
    let onMouseOver = () => {
      setCursor({ enabled: false });
    };
    let onMouseOut = () => {
      setCursor({ enabled: true });
    };

    let disableCursor = () => {
      setCursor({ enabled: false });

      if (!innerRef.current) return;
      innerRef.current.removeEventListener("mouseleave", onMouseOut);
      innerRef.current.removeEventListener("mouseenter", onMouseOver);
    };
    let enableCursor = () => {
      if (!innerRef.current) return;

      innerRef.current.addEventListener("mouseenter", onMouseOver);
      innerRef.current.addEventListener("mouseleave", onMouseOut);
    };

    if (isVisible) {
      enableCursor();
    } else {
      disableCursor();
    }

    return () => {
      disableCursor();
    };
  }, [isVisible]);

  let handleClose = () => {
    onCloseOverlay();
  };

  useKeypress("Escape", handleClose);
  useOnClickOutside(innerRef, handleClose);

  return (
    <div
      className={`overlay overlay--${slug} ${scrollable ? "is-scrollcontainer" : ""}`}
      ref={ref}
      role="dialog"
      aria-label={ariaTitle}
      tabIndex="-1"
    >
      <button className="sr-only" onClick={handleClose} tabIndex="0" aria-label="Close overlay">
        Close overlay
      </button>
      <div className="container">
        <div className="overlay__inner" ref={innerRef}>
          <div className="overlay__close">
            <button onClick={handleClose} aria-label="Close overlay">
              <IconClose></IconClose>
            </button>
          </div>
          <div className="overlay__content">{children}</div>
        </div>
      </div>
    </div>
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

export default Overlay;
