// @refresh reload
import { Show, Suspense } from "solid-js";
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
  useIsRouting,
} from "solid-start";
import Spinner from "./components/spinner";
import "./root.scss";

export default function Root() {
  const isRouting = useIsRouting()
  
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <header>
          <h2>
            <A end={true} href="/">Candas</A>
            <Show when={isRouting()}>
              <Spinner />
            </Show>
          </h2>
          <sup>By 🏕️ Humanateam</sup>
        </header>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        <sup id="lp" class="tiny"><a href="https://liberapay.com/e/donate">Donate</a> • <a href="https://github.com/boehs/candas">Git</a> • v{APP_VERSION}</sup>
        <Scripts />
      </Body>
    </Html>
  );
}
