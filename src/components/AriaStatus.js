/**
 * This component helps users with a screenreader, it notifies the user
 * of changes communicated through ariaStatusMessage
 */
import { useGlobal } from "reactn";

function AriaStatus() {
  const [currenStatusMessage] = useGlobal("ariaStatusMessage");

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {currenStatusMessage ? <span>{currenStatusMessage}</span> : ""}
    </div>
  );
}

export default AriaStatus;
