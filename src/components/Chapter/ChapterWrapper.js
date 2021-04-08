/**
 * Chapter Wrapper
 */

import { useRef, useEffect, useState } from "react";
import { useGlobal, useDispatch } from "reactn"; // <-- reactn

import ChapterPagesContinous from "components/ChapterPagesContinous/ChapterPagesContinous";
import ChapterPagesSeperate from "./ChapterPagesSeperate";

function ChapterWrapper(props) {
  const { chapterState, pageState, pageSlug, setCurrentSubChapter, transitionFinished } = props;
  const [transitionDone, setTransitionDone] = useState(false);
  const [initTimeout, setInitTimeout] = useState(false);
  const [bookColor, setBookColor] = useGlobal("bookColor");
  const setAriaStatus = useDispatch("setAriaStatus");
  const ref = useRef(false);

  const style = {
    "--theme-color": `var(--color-${chapterState.color})`
  };
  // Notify the screenreader that the chapter has changed
  useEffect(() => {
    if (pageState) {
      setTimeout(() => {
        setAriaStatus(`Navigated to chapter page: ${pageState.title}`);
      }, 50);
    }
  }, [ref, pageState, setAriaStatus]);

  // listen for transitionFinish
  useEffect(() => {
    if (!initTimeout) {
      setInitTimeout(true);
      return;
    }
    if (transitionFinished) {
      setTransitionDone(true);
    }
  }, [transitionFinished, initTimeout]);

  // change book color when chapterstate changes
  useEffect(() => {
    if (chapterState) {
      setBookColor(chapterState.color);
    }
  }, [chapterState, setBookColor]);

  return (
    <div
      id="page-main"
      className={`chapter`}
      style={style}
      data-theme={chapterState.color}
      data-chapter={chapterState.chapter_nr}
      ref={ref}
    >
      {chapterState && (
        <>
          {chapterState.continuous ? (
            <ChapterPagesContinous chapter={chapterState} page={pageState} transitionFinished={transitionDone} />
          ) : (
            <ChapterPagesSeperate
              chapter={chapterState}
              page={pageState}
              pageSlug={pageSlug}
              transitionFinished={transitionDone}
              setCurrentPage={setCurrentSubChapter}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ChapterWrapper;
