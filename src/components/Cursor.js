import React, { useState, useEffect, useCallback } from "react";
import { useGlobal } from "reactn";
import { ReactComponent as IconClose } from "../assets/icon-close-large.svg";

function Cursor(props) {
  const [cursorXY, setCursorXY] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(null);
  const [visible, setVisible] = useState(null);
  const [cursor] = useGlobal("cursor");

  useEffect(() => {
    if (cursor.enabled !== enabled) {
      setVisible(cursor.enabled);

      if (!cursor.enabled) {
        setTimeout(() => {
          setEnabled(false);
        }, 250);
      } else {
        setEnabled(cursor.enabled);
      }
    }
  }, [cursor]);

  const moveCursor = useCallback(
    (e) => {
      if (!enabled) return;
      const x = Math.round(e.clientX);
      const y = Math.round(e.clientY);

      setCursorXY({ x, y });
    },
    [enabled]
  );

  useEffect(() => {
    if (enabled) {
      document.body.classList.add("has-custom-cursor");
    } else {
      document.body.classList.remove("has-custom-cursor");
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [moveCursor]);

  return (
    <div
      className={`cursor ${enabled ? "is-enabled" : ""} ${visible ? "is-visible" : ""}`}
      style={{
        left: `${cursorXY.x}px`,
        top: `${cursorXY.y}px`
      }}
      aria-hidden="true"
    >
      <div className="cursor__pointer">
        <IconClose></IconClose>
      </div>
    </div>
  );
}

export default Cursor;
