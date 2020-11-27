import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import stateMachine, { EVENTS, STATES } from "./coffeeMachineFsm";
import './CoffeeMachine.css';

const CoffeeMachine = () => {
  const [current, send] = useMachine(stateMachine);

  const { hasCoffee, hasWater } = current.context;

  const [isBrewing, setIsBrewing] = useState(false);
  const [isBrewed, setIsBrewed] = useState(false);

  useEffect(() => {
    if (isBrewing) {
      setTimeout(() => {
        setIsBrewing(false);
        setIsBrewed(true);
      }, 2500);
    }
  }, [isBrewing]);

  useEffect(() => {
    if (isBrewed) {
      //setHasCoffee(false);
      //setHasWater(false);
    }
  }, [isBrewed])

  return (
    <div className="machine">
      <div className="water">
        <h2>Water Container</h2>
        <div className="container container--water">
        {hasWater && <div className="fill fill-water"></div>}
        </div>
      </div>
      <div className="filter">
        <h2>The Filter</h2>
        <div className="container container--filter">
        {hasCoffee && <div className="fill fill-filter"></div>}
        </div>
      </div>
      <div className="controls">
        <h2>The Controls</h2>
        <ul>
          <li><button type="button" disabled={hasWater} onClick={() => send(EVENTS.ADD_WATER)}>Add Water</button></li>
          <li><button type="button" disabled={hasCoffee} onClick={() => send(EVENTS.ADD_COFFEE)}>Add Coffee</button></li>
          <li><button type="button" disabled={!current.matches(STATES.READY) || isBrewing || isBrewed} onClick={() => setIsBrewing(true)}>Brew</button></li>
          <li><button type="button" disabled={!isBrewed} onClick={() => setIsBrewed(false)}>Pour</button></li>
        </ul>
      </div>
      <div className="pot">
        <h2>The Pot</h2>
        <div className="container container--pot">
          {isBrewed && <div className="fill fill-pot"></div>}
        </div>
      </div>
    </div>
  );
};

export default CoffeeMachine;
