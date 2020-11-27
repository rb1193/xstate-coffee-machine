import { Machine } from "xstate";

export const STATES = {
  INIT: "init",
}

const coffeeMachine = Machine({
  id: "moccamaster",
  strict: true,
  initial: STATES.INIT,
  states: {
    [STATES.INIT]: {},
  }
});

export default coffeeMachine;