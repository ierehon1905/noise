import React from "react";
import "./App.css";
import { Chart } from "./components/Chart";
import { FormSection } from "./components/FormSection";
import { useTranslation } from "./langs";
import { useAppState } from "./state";
import { StatsSection } from "./components/StatsSection";

function App() {
  const { t } = useTranslation();
  const { state } = useAppState();

  return (
    <main>
      <section className="graphs">
        <Chart title={t("signal")} chartType="signal" />
        <Chart title={t("fourier-series")} chartType="fourier" />
        <Chart title={t("received-signal")} chartType="received" />
        <StatsSection />
      </section>
      <FormSection />
    </main>
  );
}

export default App;
