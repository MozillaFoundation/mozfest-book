import parse from "html-react-parser";

function ElementText(props) {
  const hasAside = props.aside;
  return (
    <section className={`component component--text container ${hasAside ? "has-aside" : ""}`}>
      {props.aside && <aside>{parse(props.aside)}</aside>}
      <div className="text">{parse(props.text)}</div>
    </section>
  );
}

export default ElementText;
