import { useMachine } from "@xstate/react";
import stateMachine, { EVENTS, COFFEE_STATES, CUP_STATES } from "./coffeeMachineFsm";
import './CoffeeMachine.css';

const CoffeeMachine = () => {
  const [current, send] = useMachine(stateMachine);
  const { coffee, cupFilled } = current.context;
  const cupIsPresent = current.matches(`cup.${CUP_STATES.PRESENT}`)
console.log(cupFilled)
  return (
    <div className="machine">
      <div className="coffee">
        <div className="fill fill-coffee" style={{ height: `${coffee * 10}%`}}></div>
      </div>
      <div className="controls">
        <ul>
          <li><button type="button" disabled={!current.can(EVENTS.SWITCH_ON)} onClick={() => send(EVENTS.SWITCH_ON)}>Switch On</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.SWITCH_OFF)} onClick={() => send(EVENTS.SWITCH_OFF)}>Switch Off</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.ADD_COFFEE)} onClick={() => send(EVENTS.ADD_COFFEE)}>Add Coffee</button></li>
          <li><button type="button" disabled={!current.can(EVENTS.MAKE_COFFEE)} onClick={() => send(EVENTS.MAKE_COFFEE)}>Brew</button></li>
        </ul>
      </div>
      <div>
        <h2 className="machine-label">TW NCL Coffee Machine</h2>
      </div>
      <div></div>
      <div className="tap">
        <div className="pipe"></div>
        <div className={`stream ${current.matches(`coffee.${COFFEE_STATES.BREWING}`) && "stream-in-progress"}`}></div>
      </div>
      <div></div>
      <div></div>
      <div className="cup-holder" onClick={() => { send(cupIsPresent ? EVENTS.TAKE_CUP : EVENTS.PLACE_CUP) }}>
        {cupIsPresent && <div className="cup">
          <div className="cup-fill" style={{ height: `${cupFilled * 9}%` }}></div>
        </div>}
      </div>
      <div></div>
    </div>
  );
};

export default CoffeeMachine;
