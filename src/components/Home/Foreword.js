import { useGlobal } from "reactn";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

//
import Elements from "components/ContentElements/Elements";
import Image from "../Image";
import AuthorLink from "components/Author/AuthorLink";

gsap.registerPlugin(ScrollTrigger);

function Foreword() {
  const [contentForeword, setContentForeword] = useGlobal("contentForeword");
  const { authors } = contentForeword.meta;
  const [authorsList] = useGlobal("authors");

  let subtitle;

  let getAuthor = (id) => {
    let author = authorsList.find((o) => o.id === id);
    return author ? author : {};
  };

  let createSubtitle = (showDescription, separator) => {
    if (!authors || !authors.length) return null;

    let authorButtons = authors.map((o, key) => {
      let author = getAuthor(o.id);
      return (
        <span key={key}>
          <AuthorLink name={author.name} slug={author.id}></AuthorLink>
          {showDescription && author.description && author.description !== "" && <span>, {author.description}</span>}
        </span>
      );
    });

    const list = (data) => data.reduce((prev, curr) => [prev, separator, curr]);
    return <>By {list(authorButtons)} </>;
  };
  subtitle = createSubtitle(true, "; ");

  return (
    <>
      <article className="page">
        <header className="page-header ">
          <Image keepAspect={true} {...contentForeword.header_image} sizes="100vw"></Image>

          <div className="page-header__title">
            <h1>{contentForeword.title}</h1>
            {subtitle && <span className="subitle">{subtitle}</span>}
            {/* {authors.length && (
              <span>
                By <AuthorLink name={authors[0].name} slug={authors[0].id}></AuthorLink>
              </span>
            )} */}
          </div>
        </header>
        <Elements elements={contentForeword.components}></Elements>
      </article>
    </>
  );
}

export default Foreword;
