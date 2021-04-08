import parse from "html-react-parser";

function ElementQuote(props) {
  const { author, quote } = props;

  return (
    <section className="component component--quote  container">
      <blockquote>
        {parse(quote)}
        {author && <cite>{author}</cite>}
      </blockquote>
    </section>
  );
}

export default ElementQuote;
