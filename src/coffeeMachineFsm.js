import { createMachine } from "xstate";
import { assign } from "xstate";

const ACTIONS = {
  ADD_COFFEE: "addCoffee",
  FILL: "brew",
  GRIND: "grind",
  DRINK: "drink",
}

const GUARDS = {
  IS_CUP_FULL: "isCupFull",
  HAS_ROOM_FOR_MORE_COFFEE: "hasRoomForMoreCoffee",
  IS_READY: "isReady",
}

export const EVENTS = {
  ADD_COFFEE: "add_coffee",
  MAKE_COFFEE: "make_coffee",
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
    cupFilled: 0,
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
              cond: GUARDS.HAS_ROOM_FOR_MORE_COFFEE,
            },
            [EVENTS.MAKE_COFFEE]: {
              target: COFFEE_STATES.BREWING,
              cond: GUARDS.IS_READY,
              actions: [ACTIONS.GRIND],
            },
            [EVENTS.SWITCH_OFF]: {
              target: COFFEE_STATES.OFF,
            }
          }
        },
        [COFFEE_STATES.BREWING]: {
          always: {
            target: COFFEE_STATES.READY,
            cond: GUARDS.IS_CUP_FULL,
          },
          after: {
            200: {
              target: COFFEE_STATES.BREWING,
              actions: [ACTIONS.FILL],
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
          },
          exit: [ACTIONS.DRINK]
        },
      }
    }
  }
}, {
  actions: {
    [ACTIONS.ADD_COFFEE]: assign({
      coffee: ({ coffee }) => coffee + 5,
    }),
    [ACTIONS.FILL]: assign({
      cupFilled: ({ cupFilled }) => cupFilled + 1,
    }),
    [ACTIONS.DRINK]: assign({
      cupFilled: 0,
    }),
    [ACTIONS.GRIND]: assign({
      coffee: ({ coffee }) => coffee - 1,
    })
  },
  guards: {
    [GUARDS.HAS_ROOM_FOR_MORE_COFFEE]: ({ coffee }) => coffee <= 5,
    [GUARDS.IS_CUP_FULL]: ({ cupFilled }) => cupFilled >= 10,
    [GUARDS.IS_READY]: ({ coffee, cupFilled }, _, { state }) => {
      return state.matches(`cup.${CUP_STATES.PRESENT}`) && cupFilled === 0 && coffee > 0
    }
  }
});

export default coffeeMachine;