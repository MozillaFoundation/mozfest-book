import React from "react";
import { ReactComponent as IconMail } from "assets/icon-zilla-mail.svg";
import { ReactComponent as IconTwitter } from "assets/icon-zilla-twitter.svg";
import { ReactComponent as IconYoutube } from "assets/icon-zilla-youtube.svg";
import { ReactComponent as LogoMozilla } from "assets/logo-mozilla.svg";
import Icon from "components/Icon";
import { useGlobal, useDispatch } from "reactn"; // <-- reactn

function MozfestFooter(props) {
  const [globalGeneral] = useGlobal("general");

  return (
    <footer className="mozfest-footer">
      <div className="mozfest-footer__inner container">
        <div className="mozfest-footer__column">
          <div className="mozfest-footer__download">
            <a href={globalGeneral.book_download.url} className="icon-link" target="_BLANK" rel="noreferrer" download>
              <span>Download the full book</span> <Icon icon="download"></Icon>
            </a>
          </div>
          <div className="mozfest-footer__signup">
            <h5>Sign Up for News and Updates</h5>
            <p>
              Sign up below to be added to our <b>Mozilla News</b> list and stay informed in the fight for a better
              internet for all. You’ll also receive <b>Mozilla Festival</b> emails to keep you up-to-date on how to get
              involved with our signature event.
            </p>
            <a className="btn" href="https://www.mozillafestival.org/en/newsletter/" target="_blank" rel="noreferrer">
              Sign up
            </a>
          </div>
        </div>
        <div className="mozfest-footer__column">
          <div className="mozfest-footer__more-nav">
            <div className="mozfest-footer__more">
              <h5>More about us</h5>
              <ul>
                <li>
                  <a
                    data-platform="twitter"
                    href="https://twitter.com/mozillafestival"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconTwitter></IconTwitter>
                  </a>
                </li>
                <li>
                  <a
                    data-platform="youtube"
                    href="https://www.youtube.com/playlist?list=PLnRGhgZaGeBt11miYYvKSSgbxkkbKKT7p"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconYoutube></IconYoutube>
                  </a>
                </li>
                <li>
                  <a data-platform="email" href="mailto:festival@mozilla.org" target="_blank" rel="noreferrer">
                    <IconMail></IconMail>
                  </a>
                </li>
              </ul>
            </div>
            <div className="mozfest-footer__nav">
              <ul className="link-list">
                <li>
                  <a
                    id="donate-footer-btn"
                    href="https://donate.mozilla.org/"
                    rel="noopener noreferrer"
                    className="dark-theme"
                    target="_blank"
                  >
                    Donate
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mozillafestival.org/sponsor"
                    className="dark-theme"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Support MozFest
                  </a>
                </li>
                <li>
                  <a
                    href="https://careers.mozilla.org/listings/?team=Mozilla%20Foundation"
                    className="dark-theme"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mozilla.org/privacy/websites/#cookies"
                    className="dark-theme"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mozilla.org/about/legal/terms/mozilla/"
                    className="dark-theme"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Legal
                  </a>
                </li>
                <li>
                  <a href="/guidelines" className="dark-theme">
                    Participation Guidelines
                  </a>
                </li>
                <li>
                  <a href="/media" className="dark-theme">
                    Press Center
                  </a>
                </li>
                <li>
                  <a
                    href="https://mozilla.org/privacy/websites/"
                    className="dark-theme"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mozfest-footer__row">
          <a className="mozilla-logo" href="https://foundation.mozilla.org" target="_blank" rel="noreferrer">
            <LogoMozilla></LogoMozilla>
          </a>
          <div className="mozfest-footer__foundation">
            <p>
              Mozilla is a global non-profit dedicated to putting you in control of your online experience and shaping
              the future of the web for the public good. Visit us at{" "}
              <a href="https://foundation.mozilla.org" target="_blank" rel="noreferrer">
                foundation.mozilla.org
              </a>
              . Most content available under a{" "}
              <a href="https://foundation.mozilla.org/about/website-licensing/" target="_blank" rel="noreferrer">
                Creative Commons license
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MozfestFooter;
