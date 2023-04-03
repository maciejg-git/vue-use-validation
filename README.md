# vue-use-validation

Light validation composable for Vue 3.

### Examples

[Example with native input elements](https://stackblitz.com/edit/vue-use-validation?file=src/App.vue)

[Example with custom input components (recommended)](https://stackblitz.com/edit/vue-use-validation-components?file=src/App.vue)

### Simple example

```vue
<template>
  <input
    v-model="username"
    type="text"
    placeholder="Username"
    @blur="inputs.username.touch()"
  />
  <ul v-if="inputs.username.state.value === 'invalid'">
    <li v-for="m in inputs.username.messages.value">
      {{ m }}
    </li>
  </ul>

  <input
    v-model="password"
    type="text"
    @blur="inputs.password.touch()"
  />
  <ul v-if="inputs.password.state.value === 'invalid'">
    <li v-for="m in inputs.password.messages.value">
      {{ m }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';
import useValidation from './use-validation';

let username = ref('');
let password = ref('');

let inputs = useValidation([
  {
    name: 'username',
    value: username,
    rules: [
      "required",
      { minLength: 5 },
      "alphanumeric",
    ],
  },
  {
    name: 'password',
    value: password,
    rules: [
      "required",
      { minLength: 8 },
      "atLeastOneLowercase",
      "atLeastOneUppercase",
      "atLeastOneDigit",
      "atLeastOneSpecial",
    ],
    options: {
      validateOn: 'immediate',
      validateMode: 'eager',
    },
  },
]);
</script>
```

# Usage:

```typescript
let inputs = useValidation(inputs: Input | Input[], options?: GlobalOptions): Validation
```

### Arguments:

```typescript
type Input = {
  form?: object,
  name?: string,
  value: Ref,
  rules: object,
  options?: {
    validateOn?: string,
    validateMode?: string,
  },
  externalState?: Ref,
  onUpdate?: function,
  onReset?: function,
}

type GlobalOptions = {
  form?: object,
  rules?: object,
  options?: object,
  externalState?: Ref,
  onUpdate?: function,
  onReset?: function,
}
```

#### Required properties:

- **value** - value to validate (v-model of input)
- **rules** - an array of validation rules where each item is a name of global validator (`string` or `object`) or function with tested value as argument. Functions should return true for valid values or the string message if the result is invalid.

#### Optional properties:

- **form** - form object. Same form object can be used in multiple inputs to allow manual validation and resetting of entire group.
- **name** - name of input. Name is required when adding multiple inputs.
- **externalState** - external validation state to override calculated state
- **options** - object with following options:
  - **validateOn** - defines conditions to start validation. Possible conditions are:
    - "blur" - validate after input loses focus (default)
    - "immediate" - starts validating immediately after first input
    - "form" - validate after calling formValidate function
  - **validateMode** - defines how to update state according to validation results. Possible modes are:
    - "silent" - valid values does not change inputs validaton state to valid unless it was invalid before (only for validate on blur)(default)
    - "eager" - invalid and valid values always change inputs validation state

#### Optional callbacks:

- **onUpdateState** - optional callback to run on each update of validation state. This function has 3 arguments: status, state and messages.
- **onReset** - optional callback to run on form reset. This can be used to perform additional actions on reset, for example set input value to its default, as internally useValidation resets only validation related data.
For single input one validation object for that input is returned:

### Returns:

```javascript
type Validation = {
  form: object,
  name: string,
  value: Ref,
  status: Ref,
  state: Ref,
  messages: Ref,
  touch: function,
  formValidate: function,
  reset: function,
}
```

For single input one validation object is returned. For arrays of inputs validation objects are nested under their input names.

#### Validation results: 

- **status** - object containg the results of validation and the current state of input. It is updated once initially and then after each value change.
- **state** - final calculated validation state of input. By default it is empty string for initial state of input, "valid" for valid input and "invalid" for invalid input.
- **messages** - object containing validation messages.

#### Functions:

- **touch** - function that should be set as handler for inputs blur event.
- **formValidate** - function to manually validate and update validation state of the input.
- **resetValidation** - function that resets validation to default state.

#### Input properties (same as in arguments):

- **form** - form object
- **name** - name of the input
- **value** - current value of input
