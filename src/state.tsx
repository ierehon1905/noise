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
  encodedMessageBits: number[];
  scrambling: Scrambling;
  noise: number;
  noisedMessage?: number[];
  receivedMessageBits?: number[];
  decodedMessage?: string;
  errorCountBits: number;
  sendCountBits: number;
  voltage: number;
  desync: number;
  needUpdateNoisedMessage: boolean;
};

const initialState: AppState = {
  message: "le",
  decodedMessage: "le",
  highest: 64,
  lowest: 0,
  encoding: "NRZ",
  encodedMessage: getEncodedMessage("le", "NRZ", "Physical").encodedMessage,
  encodedMessageBits: getEncodedMessage("le", "NRZ", "Physical").bits,
  scrambling: "Physical",
  noise: 0,
  errorCountBits: 0,
  sendCountBits: 0,
  voltage: 0.5,
  desync: 0,
  needUpdateNoisedMessage: false,
};

type Actions<T extends keyof AppState = keyof AppState> = {
  type: "set";
  key: T;
  payload: AppState[T];
};

export type AppContextType = { state: AppState; dispatch: Dispatch<Actions> };
const AppStateContext = React.createContext<AppContextType>({
  state: initialState,
  dispatch: () => {
    throw new Error("Not initialized");
  },
});

export const useAppState = () => {
  return useContext(AppStateContext);
};

// @ts-ignore
const reducer: Reducer<AppState, Actions> = (state, action) => {
  switch (action.type) {
    case "set": {
      const key = action.key;
      if (key === "message" || key === "scrambling" || key === "encoding") {
        const newVal = {
          ...state,
          [key]: action.payload,
        };

        const { encodedMessage, bits } = getEncodedMessage(
          newVal.message,
          newVal.encoding,
          newVal.scrambling
        );

        return {
          ...newVal,
          encodedMessage: encodedMessage,
          encodedMessageBits: bits,
          sendCountBits: 0,
          errorCountBits: 0,
          needUpdateNoisedMessage: true,
        };
      }

      if (key === "receivedMessageBits") {
        if (state.needUpdateNoisedMessage) {
          return {
            ...state,
            [key]: action.payload,
            needUpdateNoisedMessage: false,
          };
        }
        const decodedMessage = getDecodedMessage(
          action.payload as number[],
          state.encoding,
          state.scrambling
        );

        // console.log(state.encodedMessageBits, bits);

        return {
          ...state,
          [key]: action.payload,
          decodedMessage,
          errorCountBits:
            state.errorCountBits +
            state.encodedMessageBits.reduce(
              (acc, curr, index) =>
                // @ts-ignore
                acc + Number(curr !== action.payload[index]),
              0
            ),
          sendCountBits: state.sendCountBits + state.encodedMessageBits.length,
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

  const stateValue = {
    state,
    dispatch,
  };

  return <AppStateContext.Provider {...props} value={stateValue} />;
};

function getEncodedMessage(
  message: string,
  encoding: Encoding,
  scrambling: Scrambling
) {
  const vals = getASCII(message, 2).split("").map(Number);

  let encodedMessage: number[] = [];

  switch (encoding) {
    case "NRZ":
      encodedMessage = vals.map((num) => (num === 0 ? -1 : 1));
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
      break;
    case "Manchester":
      encodedMessage = vals.flatMap((num) => (num === 0 ? [-1, 1] : [1, -1]));
      break;

    default:
      encodedMessage = vals.map((num) => (num === 0 ? -1 : 1));
      break;
  }

  return { encodedMessage, bits: vals };
}

function chunk(arr: number[], size: number) {
  const chunks: number[][] = [];
  let i = 0;
  while (i < arr.length) {
    chunks.push(arr.slice(i, (i += size)));
  }
  return chunks;
}

export function getDecodedBits(
  message: number[],
  encoding: Encoding,
  scrambling: Scrambling
) {
  // const vals = getASCII(message, 2).split("").map(Number);

  let bits: number[] = [];

  switch (encoding) {
    case "NRZ": {
      bits = message.map((level) => (level === -1 ? 0 : 1));
      break;
    }
    // case "RZ":
    //   encodedMessage = vals.flatMap((num) => [num === 0 ? -1 : 1, 0]);
    //   break;
    // case "AMI":
    //   let flag = false;
    //   for (const val of vals) {
    //     if (val === 0) {
    //       encodedMessage.push(0);
    //       continue;
    //     }
    //     encodedMessage.push(flag ? -1 : 1);
    //     flag = !flag;
    //   }
    //   break;
    // case "Manchester":
    //   encodedMessage = vals.flatMap((num) => (num === 0 ? [-1, 1] : [1, -1]));
    //   break;

    // default:
    //   encodedMessage = vals.map((num) => (num === 0 ? -1 : num));
    //   break;
  }

  return bits;
}

export function getDecodedMessage(
  bits: number[],
  encoding: Encoding,
  scrambling: Scrambling
) {
  // const vals = getASCII(message, 2).split("").map(Number);

  let decodedMessage: string = "";

  switch (encoding) {
    case "NRZ": {
      decodedMessage = chunk(bits, 8)
        .map((bytes) => String.fromCharCode(parseInt(bytes.join(""), 2)))
        .join("");
      break;
    }
    // case "RZ":
    //   encodedMessage = vals.flatMap((num) => [num === 0 ? -1 : 1, 0]);
    //   break;
    // case "AMI":
    //   let flag = false;
    //   for (const val of vals) {
    //     if (val === 0) {
    //       encodedMessage.push(0);
    //       continue;
    //     }
    //     encodedMessage.push(flag ? -1 : 1);
    //     flag = !flag;
    //   }
    //   break;
    // case "Manchester":
    //   encodedMessage = vals.flatMap((num) => (num === 0 ? [-1, 1] : [1, -1]));
    //   break;

    // default:
    //   encodedMessage = vals.map((num) => (num === 0 ? -1 : num));
    //   break;
  }

  return decodedMessage;
}
