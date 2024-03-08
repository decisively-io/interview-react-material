import { css, keyframes } from "styled-components";

export const DISPLAY_NAME_PREFIX = "Decisively/Interview";
export const SHOW_UNVISITED_MENU_ITEMS = false;

export const MENU_CLASS_NAMES = {
  ">list": {
    _: "list_WlKObv",
    ">item": {
      _: "item_9Bq463",

      "&.complete": "complete_KNWPo2",
      "&.active": "active_QnECa8",
      "&.visited": "visited_Dles8p",
      ">avatar": {
        _: "avatar_3IdtNl",
        ">T": "typography_wmHqqq",
      },
      ">text": "text_KmRP5i",
    },
    ">collapse": "collapse_Y0R9FN",
  },
  ">progress": {
    _: "progress_D9jF3j",

    ">bar": "bar_O9bSkR",
    ">info": {
      _: "info_l9qs6g",

      ">summary": "summary_tsZ4SR",
      ">est": "estimate_sItjZq",
    },
  },
};

const loadingAnimation = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    transform: opacity 1;
  }
`;

export const LOADING_ANIMATION_CSS = css`
  &[data-loading="true"] {
    cursor: wait;
    animation: ${loadingAnimation} 1s infinite;

    > * {
      pointer-events: none;
    }
  }
`;
