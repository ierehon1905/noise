import React, { Dispatch, Reducer, useContext, useReducer } from "react";

type Encoding = "NRZ" | "RZ" | "AMI" | "Manchester";

export type AppState = {
  message: string;
  highest?: number;
  lowest?: number;
  encoding: Encoding;
};

const initialState: AppState = {
  message: "",
  highest: 128,
  lowest: 0,
  encoding: "NRZ",
};

type Actions = { type: "set"; key: keyof AppState; payload: string | number };

type AppContextType = { state: AppState; dispatch: Dispatch<Actions> };
const AppStateContext = React.createContext<AppContextType>({
  state: initialState,
  dispatch: () => {
    throw new Error("Not initialized");
  },
});

export const useAppState = () => {
  return useContext(AppStateContext);
};

const reducer: Reducer<AppState, Actions> = (state, action) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        [action.key]: action.payload,
      };

    default:
      return state;
  }
};

export const AppStateProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppStateContext.Provider {...props} value={{ state, dispatch }} />;
};
