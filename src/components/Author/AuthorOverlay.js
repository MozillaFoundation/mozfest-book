import PortalOverlay from "components/Overlay/PortalOverlay";
import parse from "html-react-parser";
import AuthorAvatar from "./AuthorAvatar";

function AuthorOverlay(props) {
  const { participant, onCloseOverlay, isVisible } = props;

  const { name, bio, image, tagline, footer } = participant;

  return (
    <PortalOverlay isVisible={isVisible} onCloseOverlay={onCloseOverlay} doBlur={true} slug="participant-bio">
      <article className="participant-bio">
        <div className="participant-bio__header">
          <AuthorAvatar {...image}></AuthorAvatar>
          <h1>{name}</h1>
          {tagline && parse(tagline)}
        </div>
        <div className="participant-bio__body">{bio && parse(bio)}</div>
        <div className="participant-bio__footer">{footer && parse(footer)}</div>
      </article>
    </PortalOverlay>
  );
}

export default AuthorOverlay;
