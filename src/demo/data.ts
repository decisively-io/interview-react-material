import type { FileCtrlTypesNS, Session, SessionInstance } from "@decisively-io/interview-sdk";

const defaultStep: Session["steps"][0] = {
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

const fileUtils: Pick<SessionInstance, "uploadFile" | "onFileTooBig" | "removeFile"> = {
  uploadFile: ({ name }) => {
    console.log(`uploading file "${name}" to temporary storage`);

    return new Promise<FileCtrlTypesNS.UploadFileRtrn>((r) => {
      setTimeout(() => {
        console.log("upload finished");
        const id = Math.random().toString();

        r({ reference: `data:id=${id};base64,${btoa(name)}`, id });
      }, 2_000);
    });
  },
  removeFile: (ref) => {
    console.log(`removing file with ref: ${ref}`);

    return new Promise((r) => void setTimeout(r, 2_000));
  },
  onFileTooBig: (f) => {
    alert(`file ${f.name} is too big`);
  },
};

export const session: Session = {
  data: { "@parent": "" } as any,
  explanations: {
    textEmailOrNumberAttr21: "hi",
    booleanAttribute2: "test",
    attributeCurrency: "test",
    attributeDatetime: "date time explanation",
    attributeOptions: "options explanation",
    attributeTime: "explanation",
    'attr-file1-a-really-really-long-attribute-name-to-trigger-overflow-and-showcase-how-legend-behaves': 'file 1 explanation',
    'attr-file2': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    attributeTextEmailOrNumber: 'Testing explanation sidebar focus/blur',
    attributeBool: 'bool expl',
    attributeDateValidate: 'date 99999876',
    attributeDateValidateAllowManual: 'explanation attributeDateValidateAllowManual',
  },
  screen: {
    id: "screen1",
    title: "Screen 1",
    controls: [
      // {
      //   type: "file",
      //   attribute: "attr-file1-a-really-really-long-attribute-name-to-trigger-overflow-and-showcase-how-legend-behaves",
      //   id: "attr-file-id1",
      //   label: "Add identity document(-s) separate",
      //   labelDisplay: "separate",
      //   max: 2,
      //   file_type: [".txt", ".json"],
      //   // max_size: 0.005,
      //   required: true,
      // },
      // {
      //   type: "file",
      //   attribute: "attr-file2",
      //   id: "attr-file-id2",
      //   label: "Add identity document(-s) automatic",
      //   labelDisplay: "automatic",
      //   file_type: [".txt", ".json"],
      // },
      // {
      //   type: "file",
      //   attribute: "attr-file3",
      //   id: "attr-file-id3",
      //   label: "Add identity document(-s) inline",
      //   labelDisplay: "inline",
      //   file_type: [".txt", ".json"],
      // },
      // {
        //   id: "faa57800-227a-473a-b30a-c12eed0eaef4",
        //   label: "Submitted Data",
        //   // "createdAt": 1725032263381,
        //   version: 2,
        //   // "kind": "static",
        //   type: "data_container",
        //   controls: [
        //     {
        //       id: "booleanid",
        //       type: "boolean",
        //       required: true,
        //       attribute: "booleanattr",
        //       label: "Boolean Control (1)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: false,
        //       value: true,
        //     },
        //     {
        //       id: "currencyid",
        //       type: "currency",
        //       required: true,
        //       attribute: "currencyattr",
        //       label: "Currency Control (2)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: false,
        //       value: 123,
        //     },
        //     {
        //       id: "dateid",
        //       type: "date",
        //       required: true,
        //       attribute: "dateattr",
        //       label: "Date Control (3)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: false,
        //       value: "2020-01-01",
        //     },
        //     {
        //       id: "timeid",
        //       type: "time",
        //       required: true,
        //       attribute: "timeattr",
        //       label: "Time Control (4)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: false,
        //       value: "15:23:14",
        //     },
        //     {
        //       id: "datetimeid",
        //       type: "datetime",
        //       required: true,
        //       attribute: "datetimeattr",
        //       label: "DateTime Control (5)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: false,
        //       value: "2000-01-01 11:13:29",
        //     },
        //     {
        //       id: "optionsid",
        //       type: "options",
        //       required: true,
        //       attribute: "optionsattr",
        //       label: "Options control (6)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: true,
        //       value: "option2",
        //       options: [
        //         { value: "option1", label: "Option 1" },
        //         { value: "option2", label: "Option 2" },
        //       ],
        //     },
        //     {
        //       id: "numberofinstancesid",
        //       type: "number_of_instances",
        //       required: true,
        //       attribute: "number_of_instances_attr",
        //       label: "Num. of instances (7)",
        //       labelDisplay: "automatic",
        //       readOnly: true,
        //       entity: "testentity",
        //       value: [{ "@id": "1" }, { "@id": "2" }],
        //     },
        //     {
        //       id: "textid",
        //       type: "text",
        //       required: true,
        //       attribute: "textattr",
        //       label: "Text control (8)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: true,
        //       value: "test value",
        //       // value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.            ',
        //     },
        //     {
        //       id: "textid2",
        //       type: "text",
        //       required: true,
        //       attribute: "textattr2",
        //       label: "Text control (9)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       readOnly: true,
        //       value: "test 2 value",
        //       // value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.            ',
        //     },
        //     {
        //       id: "fileid",
        //       type: "file",
        //       required: true,
        //       attribute: "fileaattr",
        //       label: "File control (10)",
        //       labelDisplay: "automatic",
        //       showExplanation: false,
        //       value: {
        //         fileRefs: [
        //           "data:id=53eefeab-b0a4-40de-83d5-7eb063c909d2;base64,cmVhbGx5IGxvbmcgZmlsZW5hbWUgdG8gdGVzdCBvdmVyZmxvdyBvZiB0aGUgZmlsZSBjb250cm9sIGluIGRhdGEgY29udGFpbmVyLnR4dA==",
        //           "data:id=6bbf79d2-6e84-49cc-9473-3bc3c3dfbcc1;base64,dGVzdC5qc29u",
        //         ],
        //       },
        //     },
        //   ],
        //   columns: 2,
      // },

      {
        type: "text",
        attribute: "attributeTextEmailOrNumber",
        id: "textEmailOrNumber",
        label: "Text EmailOrNumber really",

        labelDisplay: "separate",
        sxForSeparateLabel: { marginBottom: "0 !important", backgroundColor: "orange" },

        // variation: { type: 'number' },
        // required: true,
        // disabled: true,
        labelLength: 27,
        // max: 2,
        // value: 222222 as any,
        default: 123 as any,
        // default: '4567890',
      },
      {
        type: "boolean",
        attribute: "attributeBool",
        id: "bool1",
        label: "Bool 1",
        required: true,
        // disabled: true,
        // default: false,
        // value: undefined,
      },
      {
        type: "currency",
        attribute: "attributeCurrency",
        id: "currency1",
        label: "Currency 1",
        // symbol: '$',
        default: 5,
        showExplanation: true,
        // required: true,
        // max: 1,
        // min: -10,
      },
      {
        type: "date",
        attribute: "attributeDateValidateAllowManual",
        id: "dateValidateAllowManual",
        label: "Date validate (allow manual)",
        required: true,
        allowManual: true,
        showExplanation: true,
        // min: '2022-04-01',
        // max: 'now',
        // default: '2022-01-01',
        // value: null,
        // default: '2022-01-11',
      },
      {
        type: "date",
        attribute: "attributeDateValidate",
        id: "dateValidate",
        label: "Date validate",
        required: true,
        showExplanation: true,
        // min: '2022-04-01',
        // max: 'now',
        // default: '2022-01-01',
        // value: null,
        // default: '2022-01-11',
      },
      {
        type: "datetime",
        attribute: "attributeDatetime",
        id: "datetime1",
        label: "Datetime 1",
        // disabled: true,
        showExplanation: true,
        // amPmFormat: true,
        // required: true,
        // date_max: '2022-01-01',
        // date_min: '2021-01-01',
        // time_max: '15:00:00',
        // time_min: '13:00:00',
        // minutes_increment: 15,
        // default: '2021-01-01 00:00:00',
        // value: undefined,
      },
      {
        type: "time",
        attribute: "attributeTime",
        id: "time1",
        label: "Time 1",
        // disabled: true,
        showExplanation: true,
        // required: true,
        // default: '12:00:01',
        // value: '12:22:00',
        // min: '15:22:00',
        // max: '23:11:21',
        // minutes_increment: 15,
        // allowSeconds: true,
        // amPmFormat: true,
      },
      {
        type: "options",
        attribute: "attributeOptions",
        id: "options1",
        label: "Do you have access to the service?",
        enum_id: "",
        options: [
          // { label: 'Uno', value: 'Uno' },
          // { label: 'Dos', value: 'Dos' },
          // { label: 'Tres', value: 'Tres' },
          // { label: 'Tres2', value: 'Tres2' },
          // { label: 'Tre3', value: 'Tres3' },
          { label: "Yes", value: true },
          { label: "No", value: false },
          // { label: 'I don\'t know', value: null as any },
        ],
        asRadio: true,
        // disabled: true,
        showExplanation: true,
        // required: true,
        // value: null,
        // default: 'Uno',
        // allow_other: true,
      },
      // {
        //   type: "entity",
        //   id: "entity1-UUID",
        //   min: 1,
        //   max: 2,
        //   label: "Entity 1 with a really-really-really long label so that it would surely overlow, right?",
        //   template: [
        //     {
        //       type: "typography",
        //       id: "entTypographyId1",
        //       style: "banner-yellow",
        //       text: "typography in entity",
        //     },
        //     {
        //       type: "boolean",
        //       id: "boolean2",
        //       attribute: "booleanAttribute2",
        //       label: "Boolean 2",
        //       showExplanation: true,
        //       // default: true,
        //       // required: true,
        //     },
        //     {
        //       type: "text",
        //       id: "textEmailOrNumberId21",
        //       attribute: "textEmailOrNumberAttr21",
        //       label: "TextEmailOrNumber21 21",
        //       variation: { type: "email" },
        //       showExplanation: true,
        //       // required: true,
        //       // default: 'deflt',
        //     },
        //     {
        //       type: "text",
        //       id: "textEmailOrNumberId2",
        //       attribute: "textEmailOrNumberAttr2",
        //       label: "TextEmailOrNumber2 2",
        //       variation: { type: "number" },
        //       // required: true,
        //       // default: true,
        //     },
        //     // {
        //     //   type: 'datetime',
        //     //   id: 'datetime2',
        //     //   attribute: 'datetimeAttribute2',
        //     //   date_min: '2023-01-01',
        //     //   label: 'DateTime 2',
        //     // },
        //   ],
        //   entity: "entity1",
        //   instances: [],
      // },

      // {
      //   type: "typography",
      //   id: "typographySimple",
      //   style: "h3",
      //   text: "Hello",
      //   // emoji: '😇',
      // },
      // {
      //   type: "typography",
      //   id: "typography1green",
      //   style: "banner-green",
      //   text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      //   emoji: "😇",
      // },
      // {
      //   type: "typography",
      //   id: "typography1yellow",
      //   style: "banner-yellow",
      //   text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      // },
      // {
      //   type: "typography",
      //   id: "typography1red",
      //   style: "banner-red",
      //   text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      // },
      // {
      //   type: "date",
      //   attribute: "attributeDate",
      //   id: "date1",
      //   label: "Date 1",
      //   disabled: true,
      //   allowManual: true,
      //   // min: '2022-04-01',
      //   // max: 'now',
      //   // default: '2022-01-01',
      //   // value: null,
      //   // default: '2022-01-11',
      // },
      // {
      //   type: "text",
      //   attribute: "attributeText",
      //   id: "text1",
      //   label: "Text 1",
      //   // required: true,
      //   // max: 2,
      //   // value: null,
      //   // default: 'tet',
      // },
      // // {
      // //   type: 'image',
      // //   data: 'data:image/png;base64,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',
      // //   id: 'image1',
      // // },
      // {
      //   type: "number_of_instances",
      //   entity: "number_of_instancesEntity",
      //   id: "numberOfInstances1",
      //   label: "Number of instances 1",
      //   min: 1,
      //   disabled: true,
      //   required: true,
      //   // max: 10,
      //   // default: 5,
      //   // value: null,
      // },

      // // nested entities
      // {
      //   id: "9f00b560-e109-4115-8d10-6c8fed00af77",
      //   type: "entity",
      //   template: [
      //     {
      //       id: "fafc7666-313a-45fb-9f70-d55d979ac6ca",
      //       type: "entity",
      //       template: [
      //         {
      //           id: "45ee6e21-8a3d-4ab9-b304-5025f110e1e2",
      //           label: "the clour of the hat",
      //           required: true,
      //           attribute: "c5c47f9b-4ad7-4e8a-b0bf-2e96ae44f181",
      //           type: "text",
      //         },
      //       ],
      //       label: "hats",
      //       display: "vertical",
      //       entity: "hats",
      //       instances: [],
      //     },
      //   ],
      //   label: "men",
      //   display: "vertical",
      //   entity: "men",
      //   instances: [],
      // },
    ],
    sidebars: [
      {
        type: 'explanation',
        id: 'explanation_id',
        title: 'Why we collect personal details',
        data: {
          text: 'Your privacy is important to us, but we do need to collect some details for our records. This is to ensure that we are processing information for the right person. Your details are safe with us. Please check our privacy policy on our website',
        },
        config: {
          showAttributeExplanations: true,
          text: 'Config - some text'
        },
        dynamicAttributes: [],
      },
      {
        type: 'data',
        id: 'data_id',
        title: 'Data',
        data: {
          attributes: [],
          data: [],
        },
        config: {
          description: 'We have collected the following data from you so far.'
        },
        dynamicAttributes: [],
      },
      {
        type: 'entity_list',
        data: {
          entities: [],

        },
        id: 'entity_list_id',
        title: 'Entity list title',
      },
      // {
      //   type: 'conversation',
      //   id: 'conversation_id',
      //   data: {
      //     todo: undefined,
      //   },
      //   title: 'Conversation Some title 1',
      //   config: {
      //     aiOptions: {

      //     },
      //     goal: '',
      //     interactionMode: 'same-session',
      //     initialMessage: '',
      //   },
      //   dynamicAttributes: ['attr1', 'attr2'],
      // },
      // {
      //   type: 'interview',
      //   data: {
      //     todo: undefined,
      //   },
      //   id: 'interview_id',
      //   title: 'Interview Title',
      //   config: {
      //     interactionMode: 'different-project',
      //     interviewId: '',
      //     description: '',
      //     projectId: '',
      //     workspaceId: '',
      //   },
      //   dynamicAttributes: []
      // }
    ]
  },
  context: { entity: "" },
  sessionId: "",
  status: "in-progress",
  steps: [
    {
      ...defaultStep,
      visited: true,
      id: "1",
      title: "Flight details",
      steps: [
        {
          ...defaultStep,
          id: "1.1",
          title: "Welcome",
          visited: true,
        },
        {
          ...defaultStep,
          id: "1.2",
          title: "Itinerary",
          current: true,
        },
        {
          ...defaultStep,
          id: "1.3",
          title: "Grievance",
        },
        {
          ...defaultStep,
          id: "1.4",
          title: "Airline",
        },
        {
          ...defaultStep,
          id: "1.5",
          title: "Distance",
        },
      ],
    },
    {
      ...defaultStep,
      id: "2",
      title: "What happened?",
      steps: [
        {
          ...defaultStep,
          id: "2.2",
          title: "What happened 2?",
        },
        {
          ...defaultStep,
          id: "2.3",
          title: "What happened 3?",
        },
        {
          ...defaultStep,
          id: "2.4",
          title: "What happened 4?",
        },
      ],
    },
    {
      ...defaultStep,
      id: "3",
      title: "Outcome?",
    },
  ],
  // @ts-ignore
  save(...args: unknown[]) {
    console.info(args);

    return Promise.resolve(this);
  },
  ...fileUtils,
};
