import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import stateMachine from "./coffeeMachineFsm";
import './CoffeeMachine.css';

const CoffeeMachine = () => {
  const [current, send] = useMachine(stateMachine);

  const [isReady, setIsReady] = useState(false);
  const [hasCoffee, setHasCoffee] = useState(false);
  const [hasWater, setHasWater] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);
  const [isBrewed, setIsBrewed] = useState(false);

  useEffect(() => {
    if(hasCoffee && hasWater) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [hasCoffee, hasWater]);

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
      setHasCoffee(false);
      setHasWater(false);
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
          <li><button type="button" disabled={hasWater} onClick={() => setHasWater(true)}>Add Water</button></li>
          <li><button type="button" disabled={hasCoffee} onClick={() => setHasCoffee(true)}>Add Coffee</button></li>
          <li><button type="button" disabled={!isReady || isBrewing || isBrewed} onClick={() => setIsBrewing(true)}>Brew</button></li>
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
