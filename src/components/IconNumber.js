import React from "react";
import { ReactComponent as Number01 } from "../assets/number-01.svg";
import { ReactComponent as Number02 } from "../assets/number-02.svg";
import { ReactComponent as Number03 } from "../assets/number-03.svg";
import { ReactComponent as Number04 } from "../assets/number-04.svg";
import { ReactComponent as Number05 } from "../assets/number-05.svg";
import { ReactComponent as Number06 } from "../assets/number-06.svg";

function IconNumber(props) {
  let getIcon = (nr) => {
    let returnValue;

    switch (nr) {
      case "01":
        returnValue = <Number01></Number01>;
        break;
      case "02":
        returnValue = <Number02></Number02>;
        break;
      case "03":
        returnValue = <Number03></Number03>;
        break;
      case "04":
        returnValue = <Number04></Number04>;
        break;
      case "05":
        returnValue = <Number05></Number05>;
        break;
      case "06":
        returnValue = <Number06></Number06>;
        break;
      default:
        break;
    }

    return returnValue;
  };

  return <div className="icon-number">{getIcon(props.nr)}</div>;
}

export default IconNumber;
