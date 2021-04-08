import { useDispatch } from "reactn";
import AuthorAvatar from "components/Author/AuthorAvatar";

function AuthorLink(props) {
  const { slug, name, image, no_link } = props;
  const showAuthorDispatch = useDispatch("showAuthor");

  let onClick = () => {
    showAuthorDispatch(slug);
  };

  return (
    <button
      className={`bio-link ${image ? "bio-link--avatar" : ""} ${no_link ? "bio-link--disabled" : ""}`}
      aria-label={`Visit bio of ${name}`}
      onClick={onClick}
    >
      {image && <AuthorAvatar {...image}></AuthorAvatar>}
      <span>{name}</span>
    </button>
  );
}
export default AuthorLink;
