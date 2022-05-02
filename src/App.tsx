import React, { useMemo } from "react";
import "./App.css";
import { Chart } from "./Chart";
import { FormSection } from "./FormSection";
import { useTranslation } from "./langs";
import { useAppState } from "./state";
import { getASCII } from "./utils";

function App() {
  const { t } = useTranslation();
  const { state } = useAppState();

  return (
    <main>
      <section className="graphs">
        <Chart title={t("signal")} chartType="signal" />
        <Chart title={t("fourier-series")} chartType="fourier" />
        <Chart title={t("received-signal")} chartType="received" />
        <StateSection />
      </section>
      <FormSection />
    </main>
  );
}

export default App;

export const StateSection: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useAppState();

  const encoded = useMemo(() => getASCII(state.message), [state.message]);

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
            {t("encoded")}: {encoded || "ー"}
          </div>
          <div>{t("bitrate")}: 10 Mb/s</div>
        </div>
        <div className="text-rows">
          <div>{t("recovered-message")}: todo-message</div>
          <div>{t("encoded")}: todo-message</div>
          <div>{t("bits-count")}: todo-message</div>
          <div>{t("error-count")}: todo-message</div>
          <div>{t("error-ratio")}: 10 Mb/s</div>
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
