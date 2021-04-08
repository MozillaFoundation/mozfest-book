import { useState, useMemo, useEffect } from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { debounce } from "lodash-es";

export default function useDebouncedResizeObserver(wait, target) {
  const [size, setSize] = useState({});
  const onResize = useMemo(() => debounce(setSize, wait, { leading: false }), [wait]);
  useResizeObserver(target, onResize);

  useEffect(() => {}, [size]);

  return size;
}
