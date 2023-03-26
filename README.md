# vue-use-validation

Light validation composable for Vue 3.

```javascript
let {
  status: Ref,
  state: Ref,
  messages: Ref,
  touch: Function,
  formValidate: Function,
  resetValidation: Function,
} = useValidation(
  model: Ref,
  rules: Object,
  options: Object,
  externalState: Ref,
  onUpdateState: Function,
  onReset: Function,
)
```

### What to plug into function

- **model** - value to validate
- **rules** - is an Object with validation rules where each prop is a name of global validator or user defined function with tested value as argument. User functions should return true for valid result or the string message if the result is invalid.
- **options** - object with following options:
  - **validateOn**: defines conditions to start validation. Possible conditions are:
    - "blur": validate after input loses focus (default)
    - "immediate": starts validating immediately after first input
    - "form": validate after calling formValidate function
  - **validateMode**: defines how to update state according to validation results. Possible modes are:
    - "silent": valid values does not change inputs validaton state unless it was invalid before (only for validate on blur)(default)
    - "eager": invalid and valid values always change inputs validation state
- **externalState** - external validation state to use instead of calculated state
- **onUpdateState** - function to run on each update of validation state. This function has 3 arguments: status, state and messages.
- **onReset** - function to run on form reset. This can be used to perform additional actions on reset, for example set input value to its default, as internally useValidation resets only validation related data.

### What you get in return

- **status** - object containg the results of validation and the current state of input. It is updated once initially and then after each value change.
- **state** - final calculated validation state of input.
- **messages** - object with the validation messages.
- **touch** - function that should be set as handler for inputs blur event.
- **formValidate** - function to manually validate and update validation state of the input.
- **resetValidation** - function that resets validation to default state.

#### Simple example

```vue
<template>
  <input 
    type="text"
    v-model="username"
    @blur="touch"
  >

  <div v-if="validationState === 'invalid'">
    <ul>
      <li v-for="message in messages">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import useValidation from "useValidation"

let username = ref("")

let {
  validationStatus,
  validationState,
  validationMessages,
  touch,
} = useValidation(
  username,
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
)
</script>
```

#### Validate options example

```vue
<template>
  <input 
    type="text"
    v-model="username"
    @blur="touch"
  >

  <div v-if="validationState === 'invalid'">
    <ul>
      <li v-for="message in messages">
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import useValidation from "useValidation"

let username = ref("")

let {
  validationStatus,
  validationState,
  validationMessages,
  touch,
} = useValidation(
  username,
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
  {
    validateOn: "immediate",
    validateMode: "eager",
  },
)
</script>
```

#### Form validation example

```vue
<template>
  <input 
    type="text"
    v-model="username"
    @blur="touch"
  >

  <div v-if="validationState === 'invalid'">
    <ul>
      <li v-for="message in messages">
        {{ message }}
      </li>
    </ul>
  </div>

  <button @click="formValidate">Validate</button>
  <button @click="resetValidation">Reset</button>
</template>

<script setup>
import useValidation from "useValidation"

let username = ref("")

let reset = () => (username.value = "")

let {
  validationStatus,
  validationState,
  validationMessages,
  touch,
  formValidate,
  resetValidation,
} = useValidation(
  username,
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
  {
    validateOn: "form",
  },
  null,
  null,
  reset,
)
</script>
```
