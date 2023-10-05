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
import { Input } from "antd";

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

const SearchAnimationContainer = styled(Container)`
  #result-svg {
    position: relative;
    height: 300px;
  }
  .search-svg {
    background: #fff;
    border: 1px solid red;
    display: block;
    // height: 300px;
    // max-width: 100%;
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
`;

function useInterval(callback, delay) {
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

export const ExploreSection = () => {
  const CHARACTER_INPUT_INTERVAL_MS = 45;
  const NEXT_PROMPT_DELAY_MS = 5000;
  const INITIAL_MISSION_ON_SCREEN_DELAY_MS = 2000;
  const INITIAL_MISSION_FADE_IN_DELAY_MS = 1000;
  const ANSWER_DELAY_MS = 2000;
  const FADE_OUT_MS = 800;
  const FADE_OUT_CLASS = "fade-out";
  const HIDDEN_CLASS = "hidden";
  const SLIDE_DOWN_CLASS = "slide-down";
  const INVISIBLE_CLASS = "invisible";
  const FADE_IN_CLASS = "fade-in";

  // let inputIntervalTimer, nextInputTimer: ReturnType<typeof setTimeout>;
  // let currentPromptIndex = 0;
  // let prompt;
  const inputIntervalTimer = useRef(null);
  const nextInputTimer = useRef(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  const inputEl = useRef(null);
  const searchSequenceContainer = useRef<HTMLDivElement>(null);
  // const defaultTextContainer = useRef();
  const svgDiv = useRef<HTMLDivElement>(null);
  // const promptDiv = useRef();
  // const missionDiv = useRef();
  const resultsElList = useRef();

  const [isAnimationRunning, setIsAnimationRunning] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");

  const PROMPTS = [
    {q: "What is the electricity coverage in Africa?", svg: "electricity-coverage-africa.svg"},
    {q: "How has access to electricity improved in Kenya?", svg: `electricity-improvement-kenya.svg`},
    // {q: "Progress on health-related goals in Bangladesh?", svg: ""},
    // {q: "Access to primary school education in Afghanistan", svg: ""},
    // {q: "Violence vs poverty across the world", svg: ""},
    // {q: "Women in managerial positions in India", svg: ""},
  ];

  const history = useHistory();
  // useEffect(startSearchAnimation, []);
  // debugger;
  // useEffect(() => {
  //   console.log("timeout");
  //   const timeout = setTimeout(() => {
  //     startNextPrompt();
  //   }, INITIAL_MISSION_FADE_IN_DELAY_MS);

  //   return () => {
  //     clearTimeout(timeout);
  //   }
  //   // startSearchAnimation();
  // }, [currentPromptIndex]);
  useInterval(() => {
    console.log("interval", currentPromptIndex, prompt, PROMPTS[currentPromptIndex]?.q);
    // debugger;
    // inputEl.current.value = PROMPTS[currentPromptIndex]?.q;
    setCurrentQuery(PROMPTS[currentPromptIndex]?.q);
    if (svgDiv.current) {
      // Switch animated image.
      let svgEl = svgDiv.current.childNodes.item(currentPromptIndex) as HTMLDivElement;
      svgEl.classList.add("slide-down");
      svgEl.classList.remove("hidden");
    }
    setCurrentPromptIndex(currentPromptIndex + 1);
    if (currentPromptIndex + 1 == PROMPTS.length) {
      setIsAnimationRunning(false);
      console.log("all done");
    }
  }, isAnimationRunning ? NEXT_PROMPT_DELAY_MS : null);

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
        <SearchAnimationContainer>
  {/* <div id="search-animation-container" className="container"> */}
    {/* <div id="default-text">
      <div className="content">
        <h3 className="header">Data tells interesting stories</h3>
        <h4 className="sub-header invisible" id="header-prompt">Ask a question like...</h4>
        <h4 className="sub-header hidden" id="header-mission">Data Commons, an initiative from Google,<br />organizes the world’s publicly available data<br />and makes it more accessible and useful</h4>
      </div>
    </div> */}
    <div id="search-sequence" ref={searchSequenceContainer}>
      <Input id="animation-search-input" ref={inputEl} placeholder="" autoComplete="off" type="text" className="pac-target-input search-input-text form-control" aria-invalid="false" value={currentQuery} readOnly></Input>
      <div id="result-svg" ref={svgDiv}>
        { PROMPTS.map((prompt, index) =>
          <div className="search-svg hidden" id={`svg-${index}`} style={{backgroundImage: `url(./images/datacommons/homepage/${prompt.svg})`}}></div>
        )}
      </div>
    </div>
  {/* </div> */}
        </SearchAnimationContainer>
      </SearchBarContainer>
      <Description>
        Delve into SDG data and insights with precision - where your questions
        lead the way!
      </Description>
    </Container>
  );

  function startNextPrompt() {
    let inputLength = 0;
    if (currentPromptIndex < PROMPTS.length) {
      setPrompt(PROMPTS[currentPromptIndex].q);
      console.log(currentPromptIndex, prompt, PROMPTS[currentPromptIndex]);
    } else {
      // End the animation
      // setTimeout(() => {
      //   defaultTextContainer.classList.remove(FADE_OUT_CLASS);
      // }, FADE_OUT_MS);
      searchSequenceContainer.current.classList.add(FADE_OUT_CLASS);
      clearInterval(nextInputTimer.current);
      nextInputTimer.current = undefined;
      return;
    }
    // Fade out the previous query
    if (currentPromptIndex == 0) {
      // defaultTextContainer.classList.add(FADE_OUT_CLASS);
      searchSequenceContainer.current.classList.remove(HIDDEN_CLASS);
    } else {
      // resultsElList.item(currentPromptIndex.current - 1).classList.add(FADE_OUT_CLASS);
    }
    setTimeout(() => {
      if (currentPromptIndex == 0) {
        // defaultTextContainer.classList.add(FADE_OUT_CLASS);
        svgDiv.current.classList.remove(HIDDEN_CLASS);
        // promptDiv.classList.add(HIDDEN_CLASS);
        // missionDiv.classList.remove(HIDDEN_CLASS);
      }
      // prompt.classList.remove(HIDDEN_CLASS);
      // prompt.classList.add(SLIDE_DOWN_CLASS);
      if (currentPromptIndex > 0) {
        // resultsElList.item(currentPromptIndex.current - 1).classList.add(HIDDEN_CLASS);
      }
      console.log("incrementing prompt index");
      setCurrentPromptIndex(currentPromptIndex.current + 1);
    }, ANSWER_DELAY_MS);

    // inputIntervalTimer.current = setInterval(() => {
    //   // Start typing animation
    //   if (inputLength <= prompt.dataset.query.length) {
    //     inputEl.value = prompt.dataset.query.substring(0, inputLength);
    //     // Set scrollLeft so we always see the full input even on narrow screens
    //     inputEl.scrollLeft = inputEl.scrollWidth;
    //     inputLength++;
    //   } else {
    //     // Slide in the answer
    //     clearInterval(inputIntervalTimer.current);
    //   }
    // }, CHARACTER_INPUT_INTERVAL_MS);
  }

  function startSearchAnimation() {
    setTimeout(() => {
      // promptDiv.classList.remove(INVISIBLE_CLASS);
      // promptDiv.classList.add(FADE_IN_CLASS);
      setTimeout(() => {
        startNextPrompt();
        nextInputTimer.current = setInterval(() => {
          startNextPrompt();
        }, NEXT_PROMPT_DELAY_MS);
      }, INITIAL_MISSION_ON_SCREEN_DELAY_MS);
    }, INITIAL_MISSION_FADE_IN_DELAY_MS);
  }
};