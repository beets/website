/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A component that renders the footer on all pages via the base template.
 */

import React, { ReactElement, useMemo } from "react";

import { FooterMenu, Labels, Routes } from "../../../shared/types/base";
import { resolveHref } from "../utilities/utilities";

interface FooterProps {
  //if true, the larger top-level footer will not display
  hideFullFooter: boolean;
  //if true, the smaller sub footer will not display
  hideSubFooter: boolean;
  //extra text (that can be html) that can be injected into the sub-footer.
  subFooterExtra: string;
  //if true, will display an alternate, lighter version of the logo.
  brandLogoLight: boolean;
  //the data that will populate the footer menu.
  footerMenu: FooterMenu[];
  //the labels dictionary - all labels will be passed through this before being rendered. If no value exists, the dictionary will return the key that was sent.
  labels: Labels;
  //the routes dictionary - this is used to convert routes to resolved urls
  routes: Routes;
}

const Footer = ({
  hideFullFooter,
  hideSubFooter,
  subFooterExtra,
  brandLogoLight,
  footerMenu,
  labels,
  routes,
}: FooterProps): ReactElement => {
  const visibleFooterMenu = useMemo(() => {
    return footerMenu.map((footerMenuItem) => ({
      ...footerMenuItem,
      subMenu: footerMenuItem.subMenu.filter(
        (filterSubMenuItem) => !filterSubMenuItem.hide
      ),
    }));
  }, [footerMenu]);

  return (
    <footer id="main-footer">
      {!hideFullFooter && visibleFooterMenu.length > 0 && (
        <div className="container top-footer">
          <div className="row">
            {visibleFooterMenu.map((footerMenuItem) => (
              <section
                key={footerMenuItem.label}
                className="col-12 col-sm-6 col-md-4"
              >
                <h6>{labels[footerMenuItem.label]}</h6>
                {footerMenuItem.subMenu.map((footerSubMenuItem) => (
                  <a
                    key={footerSubMenuItem.label}
                    href={resolveHref(footerSubMenuItem.href, routes)}
                  >
                    <span className="material-icons-outlined">
                      arrow_forward
                    </span>
                    <span>{labels[footerSubMenuItem.label]}</span>
                  </a>
                ))}
              </section>
            ))}
          </div>
        </div>
      )}
      {!hideSubFooter && (
        <div id="sub-footer">
          <div className="container">
            <span className="brand-byline">
              <span className="brand-text">{labels["An initiative from"]}</span>
              <img
                className="brand-logo"
                width="74"
                height="25"
                src={
                  brandLogoLight
                    ? "/images/google-logo-reverse.svg"
                    : "/images/google-logo.svg"
                }
                alt="Google logo"
              />
            </span>
            <div className="sub-footer-links">
              {subFooterExtra && (
                <div dangerouslySetInnerHTML={{ __html: subFooterExtra }} />
              )}
              <a href="https://policies.google.com/terms">
                <span>{labels["Terms and Conditions"]}</span>
              </a>
              <a href="https://policies.google.com/privacy?hl=en-US">
                <span>{labels["Privacy Policy"]}</span>
              </a>
              <a href={routes["static.disclaimers"]}>
                <span>{labels["Disclaimers"]}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
