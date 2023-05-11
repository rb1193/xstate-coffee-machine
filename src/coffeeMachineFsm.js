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
  PLACE_CUP: "place_cup",
  SWITCH_OFF: "switch_off",
  SWITCH_ON: "switch_on",
  TAKE_CUP: "take_cup",
}

export const COFFEE_STATES = {
  OFF: "off",
  READY: "ready",
  BREWING: "brewing",
}

export const CUP_STATES = {
  MISSING: "missing",
  PRESENT: "present",
}

const coffeeMachine = createMachine({
  id: "tw-ncl-coffee-machine",
  strict: true,
  predictableActionArguments: true,
  type: "parallel",
  context: {
    coffee: 0,
  },
  states: {
    coffee: {
      initial: COFFEE_STATES.OFF,
      states: {
        [COFFEE_STATES.OFF]: {
          on: {
            [EVENTS.SWITCH_ON]: {
              target: COFFEE_STATES.READY,
            }
          }
        },
        [COFFEE_STATES.READY]: {
          on: {
            [EVENTS.ADD_COFFEE]: {
              actions: [ACTIONS.ADD_COFFEE],
              cond: GUARDS.IS_NOT_FULL,
            },
            [EVENTS.BREW]: {
              target: COFFEE_STATES.BREWING,
              cond: GUARDS.IS_READY,
            },
            [EVENTS.SWITCH_OFF]: {
              target: COFFEE_STATES.OFF,
            }
          }
        },
        [COFFEE_STATES.BREWING]: {
          after: {
            2500: {
              target: COFFEE_STATES.READY,
              actions: [ACTIONS.BREW]
            }
          },
        },
      },
    },
    cup: {
      initial: CUP_STATES.MISSING,
      states: {
        [CUP_STATES.MISSING]: {
          on: {
            [EVENTS.PLACE_CUP]: {
              target: CUP_STATES.PRESENT,
            },
          }
        },
        [CUP_STATES.PRESENT]: {
          on: {
            [EVENTS.TAKE_CUP]: {
              target: CUP_STATES.MISSING,
            }
          }
        },
      }
    }
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
    [GUARDS.IS_NOT_FULL]: ({ coffee }) => coffee < 10,
    [GUARDS.IS_READY]: ({ coffee }, _, { state }) => {
      return state.matches(`cup.${CUP_STATES.PRESENT}`) && coffee > 0
    }
  }
});

export default coffeeMachine;