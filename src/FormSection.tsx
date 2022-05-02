import React from "react";
import { useTranslation } from "./langs";
import { useAppState } from "./state";

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
        <input type="range" id="1488" min={1} max={1000} />

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
      </div>
      <div className="card">
        <h2>{t("receiver")}</h2>
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
