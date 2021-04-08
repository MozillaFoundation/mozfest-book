function BookChapterLogic(options) {
  let rows = [];
  let el;
  let activeRows = [];
  let isEnabled;
  let muted;
  let mutedTimerRunning;
  let mutedTimeout;
  let hitArea;
  let rowClass = ".chapter-row";
  let isTouch;

  let getRowElByIndex = (index) => {
    return rows[index].el;
  };
  let getRowObjByEl = (el) => {
    let index = getRowElIndex(el);
    return rows[index];
  };
  let getRowElIndex = (el) => {
    return rows.map((o) => o.el).indexOf(el);
  };

  let getNrOfRows = () => {
    return rows.length;
  };

  let deActivateRows = () => {
    rows.forEach((row) => {
      deActivateRow(rows.indexOf(row));
    });
  };

  let deActivateRow = (index) => {
    let rowEl = getRowElByIndex(index);
    rowEl.classList.remove("is-expanded");

    rows[index].isExpanded = false;

    //
    if (activeRows.indexOf(index) > -1) {
      activeRows.splice(activeRows.indexOf(index), 1);
    }
  };

  let activateRow = (index, onlyAllowOne) => {
    if (activeRows.indexOf(index) > -1) return;

    if (onlyAllowOne) {
      deActivateRows();
    }

    rows[index].isExpanded = true;

    let rowEl = getRowElByIndex(index);
    rowEl.classList.add("is-expanded");
    // activeRowIndex = index;
    activeRows.push(index);
  };

  let clearMuted = () => {
    clearTimeout(mutedTimeout);
    mutedTimerRunning = false;

    muted = false;
  };

  let setMuted = () => {
    if (mutedTimeout) {
      clearTimeout(mutedTimeout);
      mutedTimerRunning = true;
    }

    mutedTimeout = setTimeout(() => {
      mutedTimerRunning = false;
    }, 250);

    muted = true;
  };

  // checks and removes mute
  let isMuted = () => {
    if (muted && mutedTimerRunning) return true;
    if (!muted) return false;

    muted = false;
    return true;
  };

  let expandNav = () => {
    if (!isEnabled) {
      enableNav();
    }

    rows.forEach((row, index) => {
      activateRow(index);
    });
  };
  let enableNav = () => {
    if (isEnabled) return;
    el.classList.add("is-enabled");
    isEnabled = true;
    if (options.onNavEnabled) {
      options.onNavEnabled();
    }
  };

  let disableNav = () => {
    if (!isEnabled) return;
    el.classList.remove("is-enabled");
    isEnabled = false;

    if (options.onNavDisabled) {
      options.onNavDisabled();
    }
  };

  let disableWhenAllDeactivated = () => {
    let activeRows = rows.filter((o) => o.isExpanded);

    if (!activeRows.length) {
      disableNav();
    }
  };

  let onDisable = (disableTillNewInput) => {
    deActivateRows();
    disableWhenAllDeactivated();

    if (disableTillNewInput) {
      setMuted();
    }
  };

  // -- Mouse Interface ---------------------------------- //
  let onRowClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (!isEnabled) {
      if (isTouch) {
        expandNav();
        return;
      }
      enableNav();
      return;
    }
    let targetRow = ev.target.closest(rowClass);
    if (!targetRow) return;
    let rowObj = getRowObjByEl(targetRow);

    if (options.onRowClick) {
      options.onRowClick(rowObj.url);
    }
  };

  let onRowEnter = (ev) => {
    if (isMuted()) return;

    let targetRow = ev.target.closest(rowClass);
    if (!targetRow) return;
    let targetRowIndex = getRowElIndex(targetRow);

    activateRow(targetRowIndex, true);
    enableNav();
  };

  let onRowLeave = (ev) => {
    let targetRow = ev.target.closest(rowClass);
    let targetRowIndex = getRowElIndex(targetRow);

    deActivateRow(targetRowIndex, true);

    // if we are moving outside the nav
    let relatedTargetIsRow;
    if (ev.relatedTarget) {
      relatedTargetIsRow = ev.relatedTarget.closest(".book-chapters");
    }

    if (!ev.relatedTarget || !relatedTargetIsRow) {
      clearMuted();
      onDisable();
    }
  };

  let onNavEnter = (ev) => {
    if (isMuted()) return;

    if (isEnabled) return;
    enableNav();
  };

  let onNavLeave = (ev) => {
    if (!ev.relatedTarget) return;
    let targetRow = ev.relatedTarget.closest(rowClass);
    if (targetRow) return;

    // when we reach this point we are leaving the complete component
    // so remove the mute
    clearMuted();

    if (!isEnabled) return;
    disableNav();
  };

  let onMouseLeaveScreen = () => {
    if (!isEnabled) return;
    onDisable();
  };

  // init
  let init = () => {
    el = options.el;
    isTouch = window.matchMedia("(pointer:coarse)").matches;

    options.rows.forEach((row) => {
      let anchorElement = row.el.querySelector("a");

      rows.push({
        el: row.el,
        elAnchor: anchorElement,
        hoverEl: row.el.querySelector(".js-hover-area"),
        slug: row.slug,
        isExpanded: false,
        url: anchorElement.getAttribute("href")
      });
    });

    hitArea = el.querySelector(".book-chapters__hitarea");

    if (options.isDynamic) {
      if (!isTouch) {
        enableHoverListeners();
      } else {
      }
    }

    hitArea.addEventListener("touchstart", () => {});

    rows.forEach((row) => {
      row.hoverEl.addEventListener("click", onRowClick);
    });

    if (options.isEnabled) {
      enableNav();
    }
    if (options.isExpanded) {
      expandNav();
    }
  };

  let disableHoverListeners = () => {
    document.removeEventListener("mouseleave", onMouseLeaveScreen);
    window.removeEventListener("mouseleave", onMouseLeaveScreen);
    hitArea.removeEventListener("mouseenter", onNavEnter);
    hitArea.removeEventListener("mouseleave", onNavLeave);

    rows.forEach((row) => {
      row.hoverEl.removeEventListener("mouseenter", onRowEnter);
      row.hoverEl.removeEventListener("mouseleave", onRowLeave);
    });
  };

  let enableHoverListeners = () => {
    document.addEventListener("mouseleave", onMouseLeaveScreen);
    window.addEventListener("mouseleave", onMouseLeaveScreen);
    hitArea.addEventListener("mouseenter", onNavEnter);
    hitArea.addEventListener("mouseleave", onNavLeave);

    rows.forEach((row) => {
      row.hoverEl.addEventListener("mouseenter", onRowEnter);
      row.hoverEl.addEventListener("mouseleave", onRowLeave);
    });
  };

  let onDisableHover = () => {
    disableHoverListeners();
  };

  let onEnableHover = () => {
    enableHoverListeners();
  };

  return {
    disable: onDisable,
    disableHover: onDisableHover,
    enableHover: onEnableHover,
    getNrOfRows: getNrOfRows,
    enable: enableNav,
    deActivateRowByIndex: deActivateRow,
    activateRowByIndex: activateRow,
    init: init
  };
}

export default BookChapterLogic;
