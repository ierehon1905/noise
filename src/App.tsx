import p5 from "p5";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Chart, sketch } from "./Chart";
import { useTranslation } from "./langs";

const colors = ["red", "green", "blue"];

function App() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="graphs">
        <Chart title={t("signal")} />
        <Chart title={t("fourier-series")} />
        <Chart title={t("received-signal")} />
        <div className="card graph">
          <h2>{t("state")}</h2>
          <div className="state">
            <div>
              <div>{t("message")}: todo-message</div>
              <div>{t("length")}: todo-message</div>
              <div>{t("encoded")}: todo-message</div>
              <div>{t("bitrate")}: 10 Mb/s</div>
            </div>
            <div>
              <div>{t("recovered-message")}: todo-message</div>
              <div>{t("encoded")}: todo-message</div>
              <div>{t("bits-count")}: todo-message</div>
              <div>{t("error-count")}: todo-message</div>
              <div>{t("error-ratio")}: 10 Mb/s</div>
            </div>
            <div>
              <div>Show</div>
              <div>
                <input type="checkbox" id="show-fourier-series" />
                <label htmlFor="show-fourier-series">
                  {t("fourier-series")}
                </label>
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
      </section>
      <section>
        <div className="card">
          <h2>{t("sender")}</h2>
          <form>
            <label htmlFor="message">{t("enter-message")}</label>
            <br />
            <input id="message" name="message" type="text" />

            <p>{t("spectrum-harmonics")}</p>
            <div>
              <label htmlFor="highest">{t("highest")} </label>
              <input type="text" name="highest" id="highest" />
            </div>
            <div>
              <label htmlFor="lowest">{t("lowest")} </label>
              <input type="text" name="lowest" id="lowest" />
            </div>
          </form>
        </div>
        <div className="card">
          <h2>{t("receiver")}</h2>
        </div>
      </section>
    </main>
  );
}

export default App;
