// @refresh reload
import { createContextProvider } from "@solid-primitives/context";
import { createSignal, Show } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.scss";

export const [ColourProvider, useColourContext] = createContextProvider(() => createSignal('0'))

export default function Root() {

  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ColourProvider>
        <Body style={{
          "--colour": useColourContext()[0]()
        }}>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
          <sup id="lp" class="tiny secondary"><a href="https://liberapay.com/e/donate">Donate</a> • <a href="https://github.com/boehs/candas">Git</a> • v{APP_VERSION}</sup>
          <Scripts />
        </Body>
      </ColourProvider>
    </Html>
  );
}
