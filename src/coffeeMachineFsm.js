import { Machine } from "xstate";
import { assign } from "xstate";

const ACTIONS = {
  ADD_COFFEE: "addCoffee",
  ADD_WATER: "addWater",
  BREW: "brew",
}

const GUARDS = {
  IS_READY: "isReady",
}

export const EVENTS = {
  ADD_COFFEE: "add_coffee",
  ADD_WATER: "add_water",
  BREW: "brew",
  POUR: "pour",
}

export const STATES = {
  EMPTY: "empty",
  READY: "ready",
  BREWING: "brewing",
  BREWED: "brewed",
}

const coffeeMachine = Machine({
  id: "moccamaster",
  strict: true,
  initial: STATES.EMPTY,
  context: {
    hasCoffee: false,
    hasWater: false,
  },
  states: {
    [STATES.EMPTY]: {
      always: [
        { target: STATES.READY, cond: GUARDS.IS_READY }
      ],
      on: {
        [EVENTS.ADD_COFFEE]: {
          actions: [ACTIONS.ADD_COFFEE],
        },
        [EVENTS.ADD_WATER]: {
          actions: [ACTIONS.ADD_WATER],
        },
      }
    },
    [STATES.READY]: {
      on: {
        [EVENTS.BREW]: {
          target: STATES.BREWING,
        }
      }
    },
    [STATES.BREWING]: {
      after:{
        2500: {
          target: STATES.BREWED,
          actions: [ACTIONS.BREW]
        }
      }
    },
    [STATES.BREWED]: {
      on: {
        [EVENTS.POUR]: {
          target: STATES.EMPTY,
        },
        [EVENTS.ADD_COFFEE]: {
          actions: [ACTIONS.ADD_COFFEE],
        },
        [EVENTS.ADD_WATER]: {
          actions: [ACTIONS.ADD_WATER],
        },
      }
    }
  }
}, {
  actions: {
    [ACTIONS.ADD_COFFEE]: assign({
      hasCoffee: true,
    }),
    [ACTIONS.ADD_WATER]: assign({
      hasWater: true,
    }),
    [ACTIONS.BREW]: assign({
      hasCoffee: false,
      hasWater: false
    }),
  },
  guards: {
    [GUARDS.IS_READY]: ({ hasCoffee, hasWater }) => hasCoffee && hasWater, 
  }
});

export default coffeeMachine;