import { Machine } from "xstate";
import { assign } from "xstate";

const ACTIONS = {
  ADD_COFFEE: "addCoffee",
  ADD_WATER: "addWater",
}

const GUARDS = {
  IS_READY: "isReady",
}

export const EVENTS = {
  ADD_COFFEE: "add_coffee",
  ADD_WATER: "add_water",
}

export const STATES = {
  INIT: "init",
  READY: "ready",
}

const coffeeMachine = Machine({
  id: "moccamaster",
  strict: true,
  initial: STATES.INIT,
  context: {
    hasCoffee: false,
    hasWater: false,
  },
  states: {
    [STATES.INIT]: {
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
    [STATES.READY]: {}
  }
}, {
  actions: {
    [ACTIONS.ADD_COFFEE]: assign({
      hasCoffee: true,
    }),
    [ACTIONS.ADD_WATER]: assign({
      hasWater: true,
    }),
  },
  guards: {
    [GUARDS.IS_READY]: ({ hasCoffee, hasWater }) => hasCoffee && hasWater, 
  }
});

export default coffeeMachine;