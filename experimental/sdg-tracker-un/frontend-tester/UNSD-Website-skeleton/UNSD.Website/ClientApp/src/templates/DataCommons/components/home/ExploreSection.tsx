/**
 * Copyright 2023 Google LLC
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

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { QUERY_PARAM_QUERY, SAMPLE_NL_QUERY } from "../../utils/constants";
import { SearchBar } from "../shared/components";
import {
  HomeSearchContainer,
  HomeSection,
  SectionDescription,
  SectionHeader,
} from "./components";
// @ts-ignore
import { routePathConstants } from "../../../../../src/helper/Common/RoutePathConstants";
import { useEffect, useRef, useState } from "react";

const Container = styled(HomeSection)`
  background-image: url(./images/datacommons/explore-background.png);
  background-color: #005677;
  flex-shrink: 0;
  gap: 36px;

  .description {
    color: #fff;
    text-align: center;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
    font-size: 30px;
    font-weight: 400;
    line-height: 50px;
    max-width: 706px;
  }
`;

const Header = styled(SectionHeader)`
  color: #fff;
`;

const Description = styled(SectionDescription)`
  color: #fff;
`;

const SearchBarContainer = styled(HomeSearchContainer)`
  .info {
    display: none;
  }

  .search {
    height: 100%;

    input {
      height: 100%;
      border-radius: 30px !important;
      font-size: 16px;
      padding-left: 20px;
      padding-right: 70px;
    }
  }

  .anticon.anticon-search {
    background-image: url(./images/datacommons/sdg-goals-icon.svg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 30px;
    height: 100%;
    width: 45px;
    right: 0;
    top: 0;

    svg {
      display: none;
    }
  }
`;

const SearchAnimationContainer = styled(HomeSearchContainer)`
  height: auto;

  input {
    margin-bottom: 24px;
    background: transparent !important;
    color: white;
    border: none;
    border-bottom: 1px solid gray;
    border-radius: 0px !important;
  }

  #result-svg {
    overflow: hidden;
    position: relative;
    height: 300px;
  }
  .search-svg {
    background: #fff;
    display: block;
    margin: 0 auto;
    position: absolute;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: auto 300px;
    width: 100%;
    height: 300px;
    overflow: hidden;
  }
  .hidden {
    display: none !important;
    position: absolute;
  }
  .slide-down {
    animation: slide-down 600ms;
  }
  @keyframes slide-down {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .fade-out {
    animation: fade-out 800ms !important;
    opacity: 0;
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

function useInterval(callback, delay: number | null) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function modulo(n, d) {
  return ((n % d) + d) % d;
}

export const ExploreSection = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [animationState, setAnimationState] = useState('START');
  const [currentQuery, setCurrentQuery] = useState("");

  const inputEl = useRef<HTMLInputElement>(null);
  const svgDiv = useRef<HTMLDivElement>(null);

  const PROMPTS = [
    {q: "What is the electricity coverage in Africa?", svg: "electricity-coverage-africa.svg"},
    {q: "How has access to electricity improved in Kenya?", svg: "electricity-improvement-kenya.svg"},
    // {q: "Progress on health-related goals in Bangladesh?", svg: "electricity-coverage-africa.svg"},
    // {q: "Access to primary school education in Afghanistan", svg: "electricity-improvement-kenya.svg"},
    // {q: "Violence vs poverty across the world", svg: "electricity-coverage-africa.svg"},
    // {q: "Women in managerial positions in India", svg: "electricity-improvement-kenya.svg"},
  ];

  const ANIMATION_TIMING = {
    'START': 0,
    'CHAR_INPUT': 45,
    'NEXT_PROMPT': 4000,
    'DONE': null,
  };

  const history = useHistory();

  // Search animation sequence
  useInterval(() => {
    console.assert(currentPromptIndex < PROMPTS.length);
    console.log("interval", currentPromptIndex, animationState, PROMPTS[currentPromptIndex].q);

    if (animationState == 'START' || animationState == 'NEXT_PROMPT') {
      let svgEl = svgDiv.current?.childNodes.item(modulo((currentPromptIndex - 1), PROMPTS.length)) as HTMLDivElement;
      svgEl?.classList.add("fade-out");
      svgEl?.classList.remove("slide-down");
      console.log(svgEl);

      setCurrentQuery("");
      setAnimationState('CHAR_INPUT');

    } else if (animationState == 'CHAR_INPUT') {
      const promptQuery = PROMPTS[currentPromptIndex]?.q;
      if (currentQuery.length < promptQuery.length) {
        setCurrentQuery(promptQuery.substring(0, currentQuery.length + 1));
        if (inputEl.current) {
          // Set scrollLeft so we always see the full input even on narrow screens
          inputEl.current.scrollLeft = inputEl.current.scrollWidth;
        }
      } else {
        setCurrentQuery(currentQuery);
        if (svgDiv.current) {
          // Switch animated image.
          let svgEl = svgDiv.current.childNodes.item(currentPromptIndex) as HTMLDivElement;
          svgEl.classList.add("slide-down");
          svgEl.classList.remove("hidden");
          svgEl.classList.remove("fade-out");
        }

        if (currentPromptIndex + 1 < PROMPTS.length) {
          setAnimationState('NEXT_PROMPT');
          setCurrentPromptIndex(currentPromptIndex + 1);
        } else {
          setAnimationState('NEXT_PROMPT');
          setCurrentPromptIndex(0);
          // setAnimationState('DONE');
          // console.log("all done");
        }
      }
    }
  }, ANIMATION_TIMING[animationState]);

  return (
    <Container>
      <Header>Explore UN Data Commons for the SDGs</Header>
      <SearchBarContainer>
        <SearchBar
          initialQuery={SAMPLE_NL_QUERY}
          isSearching={false}
          onSearch={(q) => {
            const searchParams = new URLSearchParams();
            searchParams.set(QUERY_PARAM_QUERY, q);
            history.push(
              `${
                routePathConstants.DATA_COMMONS
              }search?${searchParams.toString()}`
            );
          }}
        />
      </SearchBarContainer>
      <SearchAnimationContainer>
        <input id="animation-search-input" ref={inputEl} placeholder="" autoComplete="off" type="text" className="pac-target-input search-input-text form-control" aria-invalid="false" value={currentQuery} readOnly></input>
        <div id="result-svg" ref={svgDiv}>
          { PROMPTS.map((prompt, index) =>
            <div className="search-svg hidden" id={`svg-${index}`} key={`svg-${index}`} style={{backgroundImage: `url(./images/datacommons/homepage/${prompt.svg})`}}></div>
          )}
        </div>
      </SearchAnimationContainer>
      <Description>
        Delve into SDG data and insights with precision - where your questions
        lead the way!
      </Description>
    </Container>
  );
};