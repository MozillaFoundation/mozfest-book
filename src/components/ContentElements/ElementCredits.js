import parse from "html-react-parser";

function ElementCredits(props) {
  return (
    <section className="component component--credits container">
      <div className="credits">{parse(props.text)}</div>
    </section>
  );
}

export default ElementCredits;
