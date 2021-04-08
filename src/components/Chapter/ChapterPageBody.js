import PixelatedTitle from "./PixelatedTitle";
import { useGlobal } from "reactn";

import gsap from "gsap/gsap-core";
import Elements from "components/ContentElements/Elements";
import AuthorLink from "components/Author/AuthorLink";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterPageIntro from "./ChapterPageIntro";

gsap.registerPlugin(ScrollTrigger);

function ChapterPageBody(props) {
  const { page, chapter } = props;
  const { chapter_nr } = chapter;

  let seperateRender = () => {
    let returnValue;
    switch (chapter_nr) {
      case "06":
        returnValue = (
          <>
            <SectionTitle page={page} chapterNr={chapter.chapter_nr}></SectionTitle>
            <ChapterPageIntro page={page} chapterNr={chapter.chapter_nr} stickyAside={false}></ChapterPageIntro>
            <Elements elements={page.components}></Elements>
          </>
        );
        break;
      case "04":
        returnValue = (
          <>
            {!page.settings.hideTitle && <SectionTitle page={page} chapterNr={chapter.chapter_nr}></SectionTitle>}
            <ChapterPageIntro page={page} chapterNr={chapter.chapter_nr}></ChapterPageIntro>
            <Elements elements={page.components}></Elements>
          </>
        );
        break;
      default:
        returnValue = (
          <>
            {!page.settings.hideTitle && <SectionTitle page={page} chapterNr={chapter.chapter_nr}></SectionTitle>}
            <Elements elements={page.components}></Elements>
          </>
        );
        break;
    }
    return returnValue;
  };
  return (
    <div className="chapter-page__body" data-slug={page.slug}>
      {seperateRender()}
    </div>
  );
}

export default ChapterPageBody;

/**
 *
 */

function SectionTitle(props) {
  const { page, chapterNr } = props;
  const [darkMode] = useGlobal("darkMode");
  const [authors] = useGlobal("authors");

  let getAuthor = (id) => {
    let author = authors.find((o) => o.id === id);
    return author ? author : {};
  };

  let renderTitle = () => {
    let returnValue;
    switch (chapterNr) {
      case "05":
        returnValue = (
          <>
            <ConversationSubtitle page={page}></ConversationSubtitle>
            <PixelatedTitle title={page.title} darkMode={darkMode}></PixelatedTitle>
          </>
        );
        break;
      case "03":
      case "06":
        const { authors } = page.meta;
        var subtitle;
        let createSubtitle = (showDescription, separator) => {
          if (!authors || !authors.length) return null;

          let authorButtons = authors.map((o, key) => {
            let author = getAuthor(o.id);
            return (
              <span key={key}>
                <AuthorLink name={author.name} slug={author.id} no_link={author.no_popup}></AuthorLink>
                {showDescription && author.description && author.description !== "" && (
                  <span>, {author.description}</span>
                )}
              </span>
            );
          });

          const list = (data) => data.reduce((prev, curr) => [prev, separator, curr]);
          return <>By {list(authorButtons)} </>;
        };

        if (chapterNr === "03") {
          subtitle = createSubtitle(true, "; ");
        }
        if (chapterNr === "06") {
          subtitle = createSubtitle(false, " and ");
        }

        returnValue = (
          <>
            <span className="tagline">{page.index}</span>
            <h1>{page.title}</h1>
            <span className="subtitle">{subtitle}</span>
          </>
        );
        break;
      default:
        returnValue = (
          <>
            <span className="tagline">{page.index}</span>
            <h1>{page.title}</h1>
            {page.subtitle && <span className="subtitle">{page.subtitle}</span>}
          </>
        );
    }

    return returnValue;
  };

  return <header className="page-title container">{renderTitle()}</header>;
}

/**
 *
 */
function ConversationSubtitle(props) {
  const { page } = props;

  let author_1;
  let author_2;

  if (page.meta.authors.length > 1) {
    let authorData1 = page.meta.authors[0];
    let authorData2 = page.meta.authors[1];

    author_1 = <AuthorLink name={authorData1.name} slug={authorData1.id}></AuthorLink>;
    author_2 = <AuthorLink name={authorData2.name} slug={authorData2.id}></AuthorLink>;
  }

  return (
    <span className="tagline tagline--conversation">
      {author_1}
      <span className="italic">&nbsp;talks with&nbsp;</span>
      {author_2}
    </span>
  );
}
