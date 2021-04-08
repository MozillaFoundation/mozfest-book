import ElementText from "../ContentElements/ElementText";
import ElementImage from "../ContentElements/ElementImage";
import ElementBullets from "../ContentElements/ElementBullets";
import ElementDoubleColumn from "../ContentElements/ElementDoubleColumn";
import ElementConversation from "../ContentElements/ElementConversation";
import ElementTextImages from "../ContentElements/ElementTextImages";
import ElementQuote from "../ContentElements/ElementQuote";
import ElementStory from "../ContentElements/ElementStory";
import ElementTextScaling from "../ContentElements/ElementTextScaling";
import ElementChapterIndex from "../ContentElements/ElementChapterIndex";
import ElementCredits from "../ContentElements/ElementCredits";
import ElementInterviews from "../ContentElements/ElementInterviews";

function Elements(props) {
  const { elements } = props;

  let renderComponent = (param, key) => {
    switch (param.type) {
      case "credits":
        return <ElementCredits key={key} {...param}></ElementCredits>;
      case "text":
        return <ElementText key={key} {...param}></ElementText>;
      case "text-scaling":
        return <ElementTextScaling key={key} {...param}></ElementTextScaling>;
      case "quote":
        return <ElementQuote key={key} {...param}></ElementQuote>;
      case "story":
        return <ElementStory key={key} {...param}></ElementStory>;
      case "text-aside":
        return <ElementText key={key} {...param}></ElementText>;
      case "side-image":
        return <ElementTextImages key={key} {...param}></ElementTextImages>;
      case "image":
        return <ElementImage key={key} {...param}></ElementImage>;
      case "bullets":
        return <ElementBullets key={key} {...param}></ElementBullets>;
      case "chapter-index":
        return <ElementChapterIndex key={key} {...param}></ElementChapterIndex>;
      case "columns":
        return <ElementDoubleColumn key={key} {...param}></ElementDoubleColumn>;
      case "conversation":
        return <ElementConversation key={key} {...param}></ElementConversation>;
      case "interviews_short":
      case "interviews_long":
        return <ElementInterviews key={key} {...param}></ElementInterviews>;
      default:
        return <div key={key}>{`sdad ${param.type}`}</div>;
    }
  };

  return <>{elements.map((component, index) => renderComponent(component, index))}</>;
}

export default Elements;
