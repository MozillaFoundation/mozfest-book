import { addReducer, setGlobal, useGlobal, useEffect, useRef, useDispatch } from "reactn";

setGlobal({
  general: {},
  headerBar: { visible: false, disabled: true },
  headerHideBg: false,
  headerResetBg: false,
  cursor: { enabled: false, type: "close" },
  chapterScrolled: false,
  showChapterNav: false,
  chapterNavEnabled: false,
  showMobileOverlayMenu: false,
  darkMode: false,
  contentForeword: false,
  authors: [],
  showAuthor: false,
  chaptersData: [],
  bookColor: false,
  blur: false,
  chapterIndexOpen: false,
  currentChapter: {},
  currentSubChapter: null,
  scrollToPage: false,
  ariaStatusMessage: false,
  backgroundColor: null
});

//   -- Reducers ---------------------------------------------------------------------------------------- //
addReducer("fetchChapters", (global, dispatch) => {
  let url = process.env.REACT_APP_DATA_URL + "/index/";
  if (process.env.REACT_APP_DATA_METHOD === "json_file") {
    url = "/data/index.json";
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.chapters.forEach((chapter) => {
        if (!chapter.pages) return;
        let index = [];

        chapter.pages.forEach((page) => {
          index.push({
            slug: page.slug,
            index: page.index,
            title: page.title
          });
        });

        chapter.index = index;
      });

      return {
        general: data.general,
        chaptersData: data.chapters
      };
    });
});

addReducer("fetchAuthors", (global, dispatch) => {
  let url = process.env.REACT_APP_DATA_URL + "/authors/";
  if (process.env.REACT_APP_DATA_METHOD === "json_file") {
    url = "/data/authors.json";
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return {
        authors: data
      };
    });
});

addReducer("fetchForeword", () => {
  let url = process.env.REACT_APP_DATA_URL + "/foreword-thank-you/";
  if (process.env.REACT_APP_DATA_METHOD === "json_file") {
    url = "/data/foreword-thank-you.json";
  }
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return { contentForeword: data };
    });
});

// -- Data ---------------------------------------------------------------------------------------- //
addReducer("fetchData", async (global, dispatch) => {
  await dispatch.fetchChapters();
  await dispatch.fetchAuthors();
  await dispatch.fetchForeword();
});

// -- Blur ------------------------------------------------------------------------------------------------ //
addReducer("blur", (global, dispatch, type) => {
  let returnValue;
  switch (type) {
    case "menu-blur":
    case "index-blur":
    case "overlay-blur":
    case "preface-blur":
    case "onboarding-blur":
      returnValue = { blur: type };
      break;
    default:
      returnValue = { blur: false };
      break;
  }

  return returnValue;
});

// -- Show Author ------------------------------------------------------------------------------------------------ //
addReducer("showAuthor", (global, dispatch, author) => {
  return {
    showAuthor: author
  };
});

// -- Dark Mode
addReducer("toggleDarkMode", (global, dispatch, state) => {
  return {
    darkMode: state
  };
});

addReducer("disableHeaderBar", (global, dispatch) => {
  return {
    headerBar: { visible: false, disabled: true }
  };
});

addReducer("toggleHeaderBar", (global, dispatch, visibility) => {
  return {
    headerBar: { visible: visibility, disabled: false }
  };
});

addReducer("setAriaStatus", (global, dispatch, message) => {
  return {
    ariaStatusMessage: message
  };
});

addReducer("setBackgroundColor", (global, dispatch, color) => {
  return {
    backgroundColor: color
  };
});

addReducer("resetBackgroundColor", (global, dispatch) => {
  return {
    backgroundColor: null
  };
});
