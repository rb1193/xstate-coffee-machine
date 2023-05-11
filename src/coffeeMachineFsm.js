import { createMachine } from "xstate";
import { assign } from "xstate";

const ACTIONS = {
  ADD_COFFEE: "addCoffee",
  BREW: "brew",
}

const GUARDS = {
  IS_NOT_FULL: "isNotFull",
  IS_READY: "isReady",
}

export const EVENTS = {
  ADD_COFFEE: "add_coffee",
  BREW: "brew",
  SWITCH_OFF: "switch_off",
  SWITCH_ON: "switch_on",
}

export const STATES = {
  OFF: "off",
  READY: "ready",
  BREWING: "brewing",
}

const coffeeMachine = createMachine({
  id: "tw-ncl-coffee-machine",
  strict: true,
  initial: STATES.OFF,
  context: {
    coffee: 0,
  },
  states: {
    [STATES.OFF]: {
      on: {
        [EVENTS.SWITCH_ON]: {
          target: STATES.READY,
        }
      }
    },
    [STATES.READY]: {
      on: {
        [EVENTS.ADD_COFFEE]: {
          actions: [ACTIONS.ADD_COFFEE],
          cond: GUARDS.IS_NOT_FULL,
        },
        [EVENTS.BREW]: {
          target: STATES.BREWING,
          cond: GUARDS.IS_READY,
        },
        [EVENTS.SWITCH_OFF]: {
          target: STATES.OFF,
        }
      }
    },
    [STATES.BREWING]: {
      after:{
        2500: {
          target: STATES.READY,
          actions: [ACTIONS.BREW]
        }
      },
    },
  }
}, {
  actions: {
    [ACTIONS.ADD_COFFEE]: assign({
      coffee: ({ coffee }) => coffee + 5,
    }),
    [ACTIONS.BREW]: assign({
      coffee: ({ coffee }) => coffee - 1,
    }),
  },
  guards: {
    [GUARDS.IS_NOT_FULL]: ({coffee}) => coffee < 10,
    [GUARDS.IS_READY]: ({ coffee }) => coffee > 0,
  }
});

export default coffeeMachine;