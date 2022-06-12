import React from "react";
import { useTranslation } from "../langs";
import { useAppState } from "../state";

export const FormSection: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useAppState();

  return (
    <section>
      <div className="card">
        <h2>{t("sender")}</h2>

        <label htmlFor="message">{t("enter-message")}</label>
        <br />
        <input
          id="message"
          name="message"
          type="text"
          value={state.message}
          onChange={(e) => {
            let val = getVal(e) as string;
            val = val.replace(/[^A-Za-z0-9\s]/, "");
            dispatch({ type: "set", key: "message", payload: val });
          }}
        />

        <p>{t("spectrum-harmonics")}</p>
        <div>
          <label htmlFor="highest">{t("highest")} </label>
          <input
            type="number"
            name="highest"
            min={0}
            id="highest"
            value={state.highest}
            onChange={(e) =>
              dispatch({ type: "set", key: "highest", payload: getVal(e) })
            }
          />
        </div>
        <div>
          <label htmlFor="lowest">{t("lowest")} </label>
          <input
            type="number"
            name="lowest"
            min={0}
            id="lowest"
            value={state.lowest}
            onChange={(e) =>
              dispatch({ type: "set", key: "lowest", payload: getVal(e) })
            }
          />
        </div>

        <div>
          {["NRZ", "RZ", "AMI", "Manchester"].map((encoding) => (
            <div key={encoding}>
              <input
                type="radio"
                value={encoding}
                name="encoding"
                id={encoding}
                checked={state.encoding === encoding}
                onChange={(e) => {
                  dispatch({
                    type: "set",
                    key: "encoding",
                    payload: getVal(e),
                  });
                }}
              />
              <label htmlFor={encoding}>{encoding}</label>
            </div>
          ))}
        </div>
        <br />
        <div>
          {["Physical", "Super 4/5", "Scrambling"].map((scrambling) => (
            <div key={scrambling}>
              <input
                type="radio"
                value={scrambling}
                name="scrambling"
                id={scrambling}
                checked={state.scrambling === scrambling}
                onChange={(e) => {
                  dispatch({
                    type: "set",
                    key: "scrambling",
                    payload: getVal(e),
                  });
                }}
              />
              <label htmlFor={scrambling}>{scrambling}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>{t("receiver")}</h2>
        <div>
          <label htmlFor="noise-range">{t("noise")}</label>
          <br />
          <input
            type="range"
            name="noise-range"
            min={0}
            max={2}
            step={0.1}
            id="noise-range"
            value={state.noise}
            onChange={(e) =>
              dispatch({ type: "set", key: "noise", payload: getVal(e) })
            }
          />
          <input
            type="number"
            name="noise-number"
            min={0}
            max={2}
            step={0.1}
            id="noise-number"
            value={state.noise}
            onChange={(e) =>
              dispatch({ type: "set", key: "noise", payload: getVal(e) })
            }
          />
        </div>
        <br />
        <div>
          <label htmlFor="voltage-range">{t("voltage")}s</label>
          <br />
          <input
            type="range"
            name="voltage-range"
            min={0}
            max={2.5}
            step={0.1}
            id="voltage-range"
            value={state.voltage}
            onChange={(e) =>
              dispatch({ type: "set", key: "voltage", payload: getVal(e) })
            }
          />
          <input
            type="number"
            name="voltage-number"
            min={0}
            max={2.5}
            step={0.1}
            id="voltage-number"
            value={state.voltage}
            onChange={(e) =>
              dispatch({ type: "set", key: "voltage", payload: getVal(e) })
            }
          />
        </div>
        <br />
        <div>
          <label htmlFor="desync-range">{t("desync")}</label>
          <br />
          <input
            type="range"
            name="desync-range"
            min={0}
            max={2.5}
            step={0.1}
            id="desync-range"
            value={state.desync}
            onChange={(e) =>
              dispatch({ type: "set", key: "desync", payload: getVal(e) })
            }
          />
          <input
            type="number"
            name="desync-number"
            min={0}
            max={2.5}
            step={0.1}
            id="desync-number"
            value={state.desync}
            onChange={(e) =>
              dispatch({ type: "set", key: "desync", payload: getVal(e) })
            }
          />
        </div>
      </div>
    </section>
  );
};

const getVal = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.currentTarget.type === "number") {
    return e.currentTarget.valueAsNumber;
  }
  return e.currentTarget.value;
};
