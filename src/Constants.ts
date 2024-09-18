import type { Session } from "@decisively-io/interview-sdk";
import { css, keyframes } from "styled-components";

export const DISPLAY_NAME_PREFIX = "Decisively/Interview";
export const SHOW_UNVISITED_MENU_ITEMS = false;

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

export const CLASS_NAMES = {
  MENU: {
    LIST: "list_WlKObv",
    LIST_ITEM: "item_9Bq463",
    LIST_ITEM_COMPLETE: "complete_KNWPo2",
    LIST_ITEM_ACTIVE: "active_QnECa8",
    LIST_ITEM_VISITED: "visited_Dles8p",
    LIST_ITEM_AVATAR: "avatar_3IdtNl",
    LIST_ITEM_AVATAR_TEXT: "typography_wmHqqq",
    LIST_ITEM_TEXT: "text_KmRP5i",
    LIST_COLLAPSE: "collapse_Y0R9FN",
    PROGRESS: "progress_D9jF3j",
    PROGRESS_BAR: "bar_O9bSkR",
    PROGRESS_INFO: "info_l9qs6g",
    PROGRESS_SUMMARY: "summary_tsZ4SR",
    PROGRESS_ESTIMATE: "estimate_sItjZq",
  },

  CONTENT: {
    FORM_WRAP: "formWrap_2NgTRe",
    FORM: "form_eyu2Bt",
    FORM_HEADING: "heading_U1LjQu",
    FORM_CONTROLS: "controls_Uj4EDN",
    BUTTONS: "btns_fiwac2",
    BUTTONS_BACK: "back_Qt7DZ6",
    BUTTONS_SUBMIT: "submit_qOUndF",
    BUTTONS_NEXT: "next_ggiip5",
  },

  FRAME: {
    MENU: "menu_aBBc89",
    CONTENT: "content_KQ3zSZ",
  },

  ENTITY_CONTROL: {
    HEADING: "heading_jQlatn",
    FIELD_GROUPS: "fieldGroups_bpLNPY",
    FIELD_GROUP: "fieldGroup_0HTULO",
    FIELD_CONTROLS: "fieldControls_OkY7Py",
    FIELD_ACTIONS: "fieldActions_7nxMEV",
    ADD_BUTTON: "addIconBtn_CIglRA",
  },

  OPTIONS_CONTROL: {
    VARIANT_RADIO: "asRadio_udecnm",
    VARIANT_AUTO_COMPLETE: "autocomplete_n5JJ8qT",
  },

  SIDEBAR: {
    CONTAINER: "container_3J9Z9w",
  },
} as const;

export const DEFAULT_STEP: Session["steps"][0] = {
  complete: false,
  context: { entity: "" },
  current: false,
  id: "",
  skipped: false,
  title: "",
  visitable: true,
  visited: false,
  steps: [],
};
