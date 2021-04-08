import React from "react";
import { ReactComponent as IconBurger } from "../assets/icon-burger.svg";
import { ReactComponent as IconDownload } from "../assets/icon-download.svg";
import { ReactComponent as IconDarkmode } from "../assets/icon-darkmode.svg";
import { ReactComponent as IconArrowDown } from "../assets/icon-arrow-down.svg";
import { ReactComponent as IconArrow } from "../assets/icon-arrow.svg";
import { ReactComponent as IconHand } from "../assets/icon-hand.svg";
import { ReactComponent as IconClose } from "../assets/icon-close.svg";

function Icon(props) {
  let getIcon = (icon) => {
    let returnValue;

    switch (icon) {
      case "arrow":
        returnValue = <IconArrow></IconArrow>;
        break;
      case "arrow-down":
        returnValue = <IconArrowDown></IconArrowDown>;
        break;
      case "burger":
        returnValue = <IconBurger></IconBurger>;
        break;
      case "darkmode":
        returnValue = <IconDarkmode></IconDarkmode>;
        break;
      case "download":
        returnValue = <IconDownload></IconDownload>;
        break;
      case "hand":
        returnValue = <IconHand></IconHand>;
        break;
      case "close":
        returnValue = <IconClose></IconClose>;
        break;
      default:
        break;
    }

    return returnValue;
  };

  return (
    <figure className="icon" aria-hidden="true">
      {getIcon(props.icon)}
    </figure>
  );
}

export default Icon;
