import React, { Dispatch, Reducer, useContext, useReducer } from "react";
import { getASCII } from "./utils";

type Encoding = "NRZ" | "RZ" | "AMI" | "Manchester";
type Scrambling = "Physical" | "Super 4/5" | "Scrambling";

export type AppState = {
  message: string;
  highest?: number;
  lowest?: number;
  encoding: Encoding;
  encodedMessage: number[];
  scrambling: Scrambling;
  noise: number;
};

const initialState: AppState = {
  message: "",
  highest: 128,
  lowest: 0,
  encoding: "NRZ",
  encodedMessage: [],
  scrambling: "Physical",
  noise: 0,
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
    case "set": {
      const key = action.key;
      if (key === "message" || key === "scrambling" || key === "encoding") {
        const newVal = {
          ...state,
          [key]: action.payload,
        };

        return {
          ...newVal,
          encodedMessage: getEncodedMessage(
            newVal.message,
            newVal.encoding,
            newVal.scrambling
          ),
        };
      }

      return {
        ...state,
        [key]: action.payload,
      };
    }

    default:
      return state;
  }
};

export const AppStateProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppStateContext.Provider {...props} value={{ state, dispatch }} />;
};

function getEncodedMessage(
  message: string,
  encoding: Encoding,
  scrambling: Scrambling
): number[] {
  const vals = getASCII(message, 2).split("").map(Number);

  let encodedMessage: number[] = [];

  switch (encoding) {
    case "NRZ":
      encodedMessage = vals.map((num) => (num === 0 ? -1 : num));
      break;
    case "RZ":
      encodedMessage = vals.flatMap((num) => [num === 0 ? -1 : 1, 0]);
      break;
    case "AMI":
      let flag = false;
      for (const val of vals) {
        if (val === 0) {
          encodedMessage.push(0);
          continue;
        }
        encodedMessage.push(flag ? -1 : 1);
        flag = !flag;
      }
      // encodedMessage = vals.flatMap((num) => [num === 0 ? -1 : 1, 0]);
      break;
    case "Manchester":
      encodedMessage = vals.flatMap((num) => (num === 0 ? [-1, 1] : [1, -1]));
      break;

    default:
      encodedMessage = vals.map((num) => (num === 0 ? -1 : num));
      break;
  }

  return encodedMessage;
}
