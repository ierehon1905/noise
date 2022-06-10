import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../langs";
import { getDecodedMessage, useAppState } from "../state";
import { getASCII } from "../utils";

export const StatsSection: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAppState();
  const [counter, setcounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setcounter(counter + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const encodedCode = getASCII(state.message, 16, false);
  const decodedCode = getASCII(state.decodedMessage || "", 16, false);

  return (
    <div className="card graph state-section">
      <h2>{t("state")}</h2>
      <div className="state">
        <div className="text-rows">
          <div>
            {t("message")}: {state.message || "ー"}
          </div>
          <div>
            {t("length")}: {state.message.length}
          </div>
          <div>
            {t("encoded")}: {encodedCode || "ー"}
          </div>
          <div>{t("bitrate")}: 10 Mb/s</div>
        </div>
        <div className="text-rows" key={counter}>
          <div>
            {t("recovered-message")}: {state.decodedMessage}
          </div>
          <div>
            {t("encoded")}: {decodedCode}
          </div>
          <div>
            {t("bits-count")}: {state.sendCountBits}
          </div>
          <div>
            {t("error-count")}: {state.errorCountBits}
          </div>
          <div>
            {t("error-ratio")}:{" "}
            {Math.round((state.errorCountBits / state.sendCountBits) * 1000) /
              10}
          </div>
        </div>
        <div className="text-rows">
          <div>Show</div>
          <div>
            <input type="checkbox" id="show-fourier-series" />
            <label htmlFor="show-fourier-series">{t("fourier-series")}</label>
          </div>
          <div>
            <input type="checkbox" id="show-noise" />
            <label htmlFor="show-noise">{t("noise")}</label>
          </div>
          <div>
            <input type="checkbox" id="show-samplers" />
            <label htmlFor="show-samplers">{t("samplers")}</label>
          </div>
          <div>
            <input type="checkbox" id="show-voltage" />
            <label htmlFor="show-voltage">{t("voltage")}</label>
          </div>
        </div>
      </div>
    </div>
  );
};
