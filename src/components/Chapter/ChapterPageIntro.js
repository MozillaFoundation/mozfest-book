import { useRef } from "react";
import { useGlobal } from "reactn";
import AuthorLink from "components/Author/AuthorLink";

function ChapterPageIntro(props) {
  const { page, chapterNr } = props;
  const [authors] = useGlobal("authors");
  const pinRef = useRef();

  let getAuthorImage = (authorId) => {
    let author = authors.find((o) => o.id === authorId);
    if (!author) return false;
    return author.image;
  };

  let seperateRender = () => {
    let returnValue;
    switch (chapterNr) {
      case "06":
        returnValue = (
          <aside>
            <div ref={pinRef}>
              {page.meta.theme && (
                <>
                  <h4>THEME</h4>
                  <p>{page.meta.theme}</p>
                </>
              )}

              {page.meta.authors && (
                <>
                  <h4>AUTHORS</h4>
                  {page.meta.authors.map((author, index) => (
                    <AuthorLink
                      key={index}
                      name={author.name}
                      slug={author.id}
                      image={getAuthorImage(author.id)}
                    ></AuthorLink>
                  ))}
                </>
              )}
            </div>
          </aside>
        );
        break;
      default:
        returnValue = (
          <aside>
            <div ref={pinRef}>{page.intro.aside}</div>
          </aside>
        );
        break;
    }

    return returnValue;
  };

  return (
    <section className="page-intro container">
      {seperateRender()}
      <h2>{page.intro.title}</h2>
      <div className="text" dangerouslySetInnerHTML={{ __html: page.intro.text }}></div>
    </section>
  );
}

export default ChapterPageIntro;
