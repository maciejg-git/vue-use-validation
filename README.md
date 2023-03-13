# vue-use-validation

Validation composable for Vue 3.

```javascript
{
  validationStatus: Ref,
  validationState: Ref,
  validationMessages: Ref,
  touch: Function,
  formValidate: Function,
  resetValidation: Function,
} = useValidation(
  rules: Object,
  model: Ref,
  externalState: Ref,
  onUpdateState: Function,
  onReset: Function,
  options: Object,
)
```

### What to plug into function

**rules** - is an Object with validation rules where each prop is a name of global validator or user defined function with tested value as argument. User functions should return true for valid result or the string message if the result is invalid.
**model** - value to validate
**externalState** - external validation state to use instead of calculated validationState
**onUpdateState** - function to run on each update of validation state. This function has 3 arguments: validationStatus, validationState and validationMessages.
**onReset** - function to run on form reset. This can be used to perform additional actions on reset, for example set input value to its default, as internally useValidation resets only validation related data.
**options** - object with following options:
  **validateOn**: defines how to start validation. Possible conditions:
    "blur": validate after input loses focus (default)
    "immediate": starts validating immediately after first input
    "form": validate after calling formValidate function
  **validateMode**: defines how to update state according to validation results. Possible modes:
    "silent": valid values does not change inputs validaton state unless it was invalid before (only for validate on blur)(default)
    "eager": invalid and valid values always change inputs validation state

### What you get in return

**validationStatus** - object with the details of validation results. It is updated once initially and then after each inputs value change.
**validationState** - final calculated validation state of input.
**validationMessages** - object with the validation messages.
**touch** - function that should be called as handler for input blur event.
**formValidate** - function to manually validate and update validation state of the input.
**resetValidation** - function to reset validation.

### How to use those

Simple example

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
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
  username,
)
</script>
```

Validate options example

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
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
  username,
  null,
  null,
  null,
  {
    validateOn: "immediate",
    validateMode: "eager",
  }
)
</script>
```

Form validation example

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
  {
    required: true,
    minLength: 5,
    alphanumeric: true,
  },
  username,
  null,
  null,
  reset,
  {
    validateOn: "form",
  }
)
</script>
```
