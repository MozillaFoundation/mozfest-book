function AuthorAvatar(props) {
  const { src, alt, name } = props;

  var style = {
    backgroundImage: `url(${src})`
  };

  return (
    <div className="author-avatar">
      <figure aria-label={`Profile picture of ${name}`} role="img" alt={alt}>
        <div style={style}></div>
        {/* <img ></img> */}
      </figure>
    </div>
  );
}

export default AuthorAvatar;
