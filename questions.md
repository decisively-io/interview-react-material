# Questions


### General

- how `id` looks like in all interfaces (uuid, integers, etc)?
- "\<uuid\>" denotes stringified uuid like "6f77e42f-0f91-42cf-b41d-19c107d69403"?
- some interfaces ( like IDate ) contain two `deafult` properties. What does that mean?
- in general, what does this notion means "\<string: YYYY-MM-DD\>", is that "type is string, default value is YYYY-MM-DD"?
- "\<string: YYYY-MM-DD\>" does this correspond to "2022-03-28"?
- can we replace all `snake_case` properties with `camelCase` ones?
- "\<string: HH-mm-ss\>" does this correspond to "20-15-45"?
- how does "\<datetime\>" look like?
- how does "\<time\>" look like?
- if possible, mark fields that are optional with [this](https://www.typescriptlang.org/docs/handbook/interfaces.html#optional-properties)


### Per interface

[IBoolean](./src/types/controls.ts#L9)
- attribute is like "6f77e42f-0f91-42cf-b41d-19c107d69403"?

[IDate](./src/types/controls.ts#L44)
- `min` and `allow_past` are kinda the overlapping, we can just have appropriate min and remove `allow_past` entirely (same with `max` and `allow_future`)

[ITime](./src/types/controls.ts#L68)
- what format to use: `HH:mm:ss` or `HH-mm-ss`?
- second default property seems incorrect (uses only date part of datetime), right?

[IDateTime](./src/types/controls.ts#L95)
- according to [this](https://en.wikipedia.org/wiki/ISO_8601), datetime string is like "2022-03-28T16:21:09Z", but example lacks letter "T" in the middle ("YYYY-MM-DD HH:mm:ssZ"), so no letter "T"?
- `date_min`, `time_min` and `allow_past` are overlapping and can be replaced by `min` being full ISO date string


[IOptions](./src/types/controls.ts#L142)
- incorrect `default` shape?
- I strongly believe that for designing system from scratch, having `any` as type is error-prone (also, it is generally non-stringifiable). Can we have it more precise?
- how should "add new option" function, if options as baked inside this interface? do I get updated interface after some manipulation?
- should `enum_id` even be here, if for my purpose it will never come from BE?

[IFile](./src/types/controls.ts#L165)
- do we assume that `max_size` is always "number of megabytes"?