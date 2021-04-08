/**
 * The onboarding menu is the menu on the home which expands and collapses.
 * This onboarding menu has the purpose of instructing the user how to use the website.
 */

import { useDispatch } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useLayoutEffect } from "react";
import BookChaptersUI from "components/BookChapterNav/BookChaptersUI";

gsap.registerPlugin(ScrollTrigger);

function OnBoardingMenu() {
  const ref = useRef();
  const innerRef = useRef();

  const chaptersUIRef = useRef();
  const triggerRef = useRef();

  const isMobile = window.matchMedia("(max-width:600px)").matches;
  const isExpanded = isMobile;
  const activateBlur = useDispatch("blur");
  const isOnBoarding = useRef(false);

  let setPositionFixed = () => {
    let node = innerRef.current;
    let nrOfRows = chaptersUIRef.current.control.current.getNrOfRows();
    let bnd = node.getBoundingClientRect();

    gsap.set(node, { position: "fixed", top: bnd.top });

    for (let i = nrOfRows - 1; i > 0; i--) {
      let reverseIndex = nrOfRows - i;
      setTimeout(() => {
        chaptersUIRef.current.control.current.deActivateRowByIndex(reverseIndex);
      }, (reverseIndex - 1) * 50);
    }

    setTimeout(() => {
      chaptersUIRef.current.control.current.disable();
    }, 300);

    setTimeout(() => {
      gsap.to(node, { top: "50%", yPercent: -50 });
      chaptersUIRef.current.control.current.enableHover(true);
    }, 500);
  };

  let setPositionAbsolute = () => {
    chaptersUIRef.current.control.current.disableHover(true);

    let node = innerRef.current;
    let bnd = node.getBoundingClientRect();

    gsap.set(node, { position: "absolute", top: window.scrollY + bnd.top + "px", yPercent: 0 });
    chaptersUIRef.current.control.current.enable();
  };

  useLayoutEffect(() => {
    if (isMobile) return;

    triggerRef.current = ScrollTrigger.create({
      trigger: ref.current,
      start: () => {
        let bnd = innerRef.current.getBoundingClientRect();
        return `top ${bnd.top}px`;
      },
      end: () => {
        let bnd = innerRef.current.getBoundingClientRect();
        return `bottom ${window.innerHeight - bnd.top}`;
      },
      onEnter: () => {
        isOnBoarding.current = true;
        setPositionAbsolute();
      },
      onUpdate: ({ progress, direction, isActive }) => {
        let nrOfItems = chaptersUIRef.current.control.current.getNrOfRows() - 1;
        let snapped = Math.round((progress * nrOfItems) / 1) * 1;

        if (direction === 1) {
          for (let a = 0; a <= snapped; a++) {
            chaptersUIRef.current.control.current.activateRowByIndex(a);
          }
        }
      },
      onLeaveBack: () => {
        isOnBoarding.current = false;
        setPositionFixed();
      }
    });
    return () => {
      if (triggerRef.current) triggerRef.current.kill(true);
    };
  }, [isMobile]);

  let onNavEnabled = () => {
    if (isOnBoarding.current) return;
    activateBlur("onboarding-blur");
  };

  let onNavDisabled = () => {
    activateBlur();
  };

  return (
    <div className="home-onboard-menu" ref={ref}>
      <div className="home-onboard-menu__inner" ref={innerRef}>
        <BookChaptersUI
          ref={chaptersUIRef}
          isDynamic={!isMobile}
          isExpanded={isExpanded}
          isEnabled={isExpanded}
          onNavDisabled={onNavDisabled}
          onNavEnabled={onNavEnabled}
        ></BookChaptersUI>
      </div>
    </div>
  );
}

export default OnBoardingMenu;
