import { useMachine } from "@xstate/react";
import stateMachine, { EVENTS, STATES } from "./coffeeMachineFsm";
import './CoffeeMachine.css';

const CoffeeMachine = () => {
  const [current, send] = useMachine(stateMachine);
  const { coffee } = current.context;

  return (
    <div className="machine">
      <div className="coffee">
        <h2>The Coffee</h2>
        <div className="fill fill-coffee" style={{ height: `${coffee * 10}%`}}></div>
      </div>
      <div className="controls">
        <h2>The Controls</h2>
        <ul>
          <li><button type="button" disabled={!current.can(EVENTS.SWITCH_ON)} onClick={() => send(EVENTS.SWITCH_ON)}>Switch On</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.SWITCH_OFF)} onClick={() => send(EVENTS.SWITCH_OFF)}>Switch Off</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.ADD_COFFEE)} onClick={() => send(EVENTS.ADD_COFFEE)}>Add Coffee</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.BREW)} onClick={() => send(EVENTS.BREW)}>Brew</button></li>
        </ul>
      </div>
      <div></div>
      <div></div>
      <div className="tap">
        <div className="pipe"></div>
        <div className={`stream ${current.matches(STATES.BREWING) && "stream-in-progress"}`}></div>
      </div>
      <div></div>
      <div></div>
      <div class="cup-holder">
        <div class="cup">
          <div class="cup-fill"></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default CoffeeMachine;
