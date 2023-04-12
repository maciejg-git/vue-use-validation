import { ref, nextTick } from "vue";
import useValidation from "../use-validation";

let defaultRules = ["required"];

let defaultStatus = {
  touched: false,
  dirty: false,
  valid: false,
  optional: false,
  validated: false,
};

describe("returns correct initial values", () => {
  test("status, state and messages", () => {
    let value = ref("");

    let { status, state, messages } = useValidation({
      value,
      rules: defaultRules,
    });

    expect(status.value).toEqual(defaultStatus);
    expect(state.value).toBe("");
    expect(messages.value).toEqual({});
  });

  test("touch, formValidate and reset functions", () => {
    let value = ref("");

    let { touch, formValidate, reset } = useValidation({
      value,
      rules: defaultRules,
    });

    expect(typeof touch).toBe("function");
    expect(typeof formValidate).toBe("function");
    expect(typeof reset).toBe("function");
  });
});

describe("updates", () => {
  test("status on value change", async () => {
    let value = ref("");

    let { status, state, messages } = useValidation({
      value,
      rules: defaultRules,
    });

    value.value = "a";

    await nextTick();
    expect(status.value.dirty).toBe(true);
  });

  test("status on touch", () => {
    let value = ref("");

    let { status, state, messages, touch } = useValidation({
      value,
      rules: defaultRules,
    });

    touch();

    expect(status.value.touched).toBe(true);
  });

  test("status on formValidate", () => {
    let value = ref("");

    let { status, state, messages, formValidate } = useValidation({
      value,
      rules: defaultRules,
    });

    formValidate();

    expect(status.value.validated).toBe(true);
  });
});

test("sets status dirty on dirty inputs", async () => {
  let value = ref("");

  let { status, state, messages } = useValidation({
    value,
    rules: defaultRules,
  });

  value.value = "a";

  await nextTick();
  expect(status.value.dirty).toBe(true);
});

test("sets status touched on touched inputs", () => {
  let value = ref("");

  let { status, state, messages, touch } = useValidation({
    value,
    rules: defaultRules,
  });

  touch();

  expect(status.value.touched).toBe(true);
});

test("updates messages", () => {
  let value = ref("");

  let { status, state, messages, touch } = useValidation({
    value,
    rules: defaultRules,
  });

  touch();

  expect(messages.value).toHaveProperty("required");
});

test("sets external state", async () => {
  let value = ref("");
  let externalState = ref("");

  let { status, state, messages } = useValidation({
    value,
    rules: defaultRules,
    externalState,
  });

  expect(state.value).toBe("");

  externalState.value = "invalid";

  await nextTick();

  expect(state.value).toBe("invalid");
});

test("validate on blur (validateOn === 'blur')", async () => {
  let value = ref("");

  let { status, state, messages, touch } = useValidation({
    value,
    rules: defaultRules,
    options: {
      validateOn: "blur",
    },
  });

  value.value = "a";
  await nextTick();
  expect(state.value).toBe("");

  value.value = "";
  await nextTick();
  expect(state.value).toBe("");

  touch();
  await nextTick();
  expect(state.value).toBe("invalid");
});

test("adds each validator property to messages", async () => {
  let value = ref("");

  let { status, state, messages, touch } = useValidation({
    value,
    rules: [...defaultRules, "email", "alphanumeric", { minLength: 5 }],
  });

  touch();

  await nextTick();
  expect(messages.value).toHaveProperty("required");
  expect(messages.value).toHaveProperty("email");
  expect(messages.value).toHaveProperty("alphanumeric");
  expect(messages.value).toHaveProperty("minLength");
});

test("adds each validator property to status", async () => {
  let value = ref("");

  let { status, state, messages, touch } = useValidation({
    value,
    rules: [...defaultRules, "email", "alphanumeric", { minLength: 5 }],
  });

  touch();

  await nextTick();
  expect(status.value).toHaveProperty("required");
  expect(status.value).toHaveProperty("email");
  expect(status.value).toHaveProperty("alphanumeric");
  expect(status.value).toHaveProperty("minLength");
});

describe("onUpdate callback", () => {
  test("is called once initially", () => {
    let value = ref("");

    let onUpdate = vi.fn();

    let { status, state, messages, touch } = useValidation({
      value,
      rules: defaultRules,
      onUpdate,
    });

    expect(onUpdate).toHaveBeenCalled();
  });

  test("is called on update", async () => {
    let value = ref("");

    let onUpdate = vi.fn();

    let { status, state, messages, touch } = useValidation({
      value,
      rules: defaultRules,
      onUpdate,
    });

    value.value = "a"

    await nextTick()

    expect(onUpdate).toHaveBeenCalledTimes(2);
  });

  test("is called on touch", () => {
    let value = ref("");

    let onUpdate = vi.fn();

    let { status, state, messages, touch } = useValidation({
      value,
      rules: defaultRules,
      onUpdate,
    });

    touch();

    expect(onUpdate).toHaveBeenCalledTimes(2);
  });

  test("is called on form validate", () => {
    let value = ref("");

    let onUpdate = vi.fn();

    let { status, state, messages, formValidate } = useValidation({
      value,
      rules: defaultRules,
      onUpdate,
    });

    formValidate();

    expect(onUpdate).toHaveBeenCalledTimes(2);
  });

  test("is called with status, state and messages arguments", () => {
    let value = ref("");

    let onUpdate = vi.fn();

    let { status, state, messages, touch } = useValidation({
      value,
      rules: defaultRules,
      onUpdate,
    });

    touch();

    expect(onUpdate).toHaveBeenCalledWith(status, state, messages);
  });
});

test("returns correct object for array of inputs", () => {
  let value = ref("");
  let password = ref("");

  let inputs = useValidation([
    {
      value,
      rules: defaultRules,
      name: "username",
    },
    {
      value: password,
      rules: defaultRules,
      name: "password",
    },
  ]);

  expect(inputs).toHaveProperty("username");
  expect(inputs).toHaveProperty("password");
  expect(inputs.username).toHaveProperty("status");
  expect(inputs.password).toHaveProperty("status");
});
