import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Dialogue from "../Dialogue/index";
gsap.registerPlugin(ScrollTrigger);

function ElementConversation(props) {
  return (
    <div className="component component--conversation container">
      <Dialogue {...props}></Dialogue>
    </div>
  );
}
export default ElementConversation;
