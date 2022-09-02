const reducer = (state, payload) => {
  const { stateName, value } = payload;
  let newState = {...state};
  switch (payload.stateName) {
    case "photoList":
      newState.photoList = [...newState.photoList, ...value];
      break;

    default:
      newState = { ...newState, [stateName]: value };
      break;
  }

  return newState
};

function PubSub() {
  let subscriptions = {};
  const publish = (stateName, stateValue) => {
    if (subscriptions[stateName] && subscriptions[stateName].length) {
      for (let callback of subscriptions[stateName]) {
        callback(stateValue);
      }
    }
  };

  const subscribe = (stateName, callback) => {
    if (typeof stateName === "string" && typeof callback === "function") {
      subscriptions[stateName] = subscriptions[stateName]
        ? [...subscriptions[stateName], callback]
        : [callback];
    }
  };
  return { subscribe, publish };
}

function Store() {
  let state = {
    isAuthenticated: false,
    pageIndex: 0,
    photoList: [],
  };
  const expose = {};
  const pubsub = new PubSub();

  expose.getState = () => {
    return state;
  };

  expose.setState = (stateName, value) => {
    if (!!stateName && !!value) {
      state = { ...state, [stateName]: value };
      const newState = reducer(state, {stateName, value});
      store.state = newState;
      pubsub.publish(stateName, value);
    } else throw new Error("state name or value is missing");
  };

  return { ...expose, subscribe: pubsub.subscribe };
}



export const store = new Store({});
