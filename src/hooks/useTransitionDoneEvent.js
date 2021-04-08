import { Provider as BusProvider, useBus, useListener } from "react-bus";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

export default function useTransitionDoneEvent() {
  const [isTransitionDone, setIsTransitionDone] = useState(false);

  useListener("transitionDone", () => {
    setIsTransitionDone(true);
  });

  return isTransitionDone;
}
