# Questions


### General

- how `id` looks like in all interfaces (uuid, integers, etc)?
    - as uuid v4 (eg: 3383c5a2-b8ec-4960-9ff9-6e5a0f5fcfa9)
- "\<uuid\>" denotes stringified uuid like "6f77e42f-0f91-42cf-b41d-19c107d69403"?
    - yes
- some interfaces ( like IDate ) contain two `deafult` properties. What does that mean?
    - that was an error sorry. Only one default
- in general, what does this notion means "\<string: YYYY-MM-DD\>", is that "type is string, default value is YYYY-MM-DD"?
    - yes. It will send back a date you can parse, but not a date object. It will be in that form (YYYY-MM-DD)
- "\<string: YYYY-MM-DD\>" does this correspond to "2022-03-28"?
    - yes
- can we replace all `snake_case` properties with `camelCase` ones?
    - we have most of the api in snake_case rather than camelCase. Is there a reason why you'd like the change?
- "\<string: HH-mm-ss\>" does this correspond to "20-15-45"?
    - yes - eplicitly always in 24 hour time. Sorry this should be 20:15:45 (: not -, the clickup was wrong)
- how does "\<datetime\>" look like?
    - in terms of UI: a control that lets me set and display a date and a time. In terms of default: HH:mm:ss. Sorry the definitions in clickup incorrectly had the wrong format for time. I've fixed those
- how does "\<time\>" look like?
    - see above
- if possible, mark fields that are optional with [this](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)
  - done. Updated in clickup

### Per interface

[IBoolean](./src/types/controls.ts#L9)
- attribute is like "6f77e42f-0f91-42cf-b41d-19c107d69403"?
  - Yes attributes are also uuid v4 ids.

[IDate](./src/types/controls.ts#L44)
- `min` and `allow_past` are kinda the overlapping, we can just have appropriate min and remove `allow_past` entirely (same with `max` and `allow_future`)
  - Unfortunatley no. Min would be static (eg: not before 2010-01-01) where as allowPast: false would use a changing period of time that is not allowed. Eg: if you just had min you would have to update the min every day if you didn't want them to provide a date in the past.


[ITime](./src/types/controls.ts#L68)
- what format to use: `HH:mm:ss` or `HH-mm-ss`?
  - Sorry. Mistake on entry. Should be :
- second default property seems incorrect (uses only date part of datetime), right?
  - Yes fixed.

[IDateTime](./src/types/controls.ts#L95)
- according to [this](https://en.wikipedia.org/wiki/ISO_8601), datetime string is like "2022-03-28T16:21:09Z", but example lacks letter "T" in the middle ("YYYY-MM-DD HH:mm:ssZ"), so no letter "T"?
  - No T. Custom date time.
- `date_min`, `time_min` and `allow_past` are overlapping and can be replaced by `min` being full ISO date string
  - They are seperate as you may want to restrict a certain time of the day, but not the date. Eg: I want to allow any date, but only between the hours of 9am to 5pm. time_min seperate allows me to do this. See comments for why we need allow and min above.

[IOptions](./src/types/controls.ts#L142)
- incorrect `default` shape?
  - Yes. Fixed.
- I strongly believe that for designing system from scratch, having `any` as type is error-prone (also, it is generally non-stringifiable). Can we have it more precise?
  - Sure, please replace with appropriate wording/labelling
- how should "add new option" function, if options as baked inside this interface? do I get updated interface after some manipulation?
  - As in the allow_other? This just means that the user can select from the list OR provide their own. In this context we would assume the server won't be validating that response is one of the chosen options.
- should `enum_id` even be here, if for my purpose it will never come from BE?
  - For your purposes no - but it's in there as the designers of the backend need to see it. I didn't have time to create payloads for both as they are generally the same, except for this. See notes in clickup

[IFile](./src/types/controls.ts#L165)
- do we assume that `max_size` is always "number of megabytes"?
  - Yes.



- default and controlled/uncontrolled issue - two react components
  locale - noted in clickup
- min/max in Date and allow_past/allow_future - 'now'
- dateMax and time - how do they interact. If date max is '2021-10-21' and
  timeMax '22:00:00' - which one is the source of truth? '2021-10-20 23:00:00' - invalid
  both components are merged
  dateMax 'now' - only date component
- Time/DateTime seconds_increment kinda not achievable
  allow seconds + change all ?: boolean to ?: true
- options: has no required as props,
  (does null mean absent) yes
- required entity, how does that work?
  read on IEntity

- submit entity, array duplicates its values
  for mapping see https://app.clickup.com/6970096/v/dc/6mpqg-12602/6mpqg-18002

- entity horizontal, not sure how
 horizontal means a table
