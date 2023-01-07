// @refresh reload
import { Suspense } from "solid-js";
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

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { isServer } from "solid-js/web";
import { useRequest } from "solid-start/server";
import { State } from "./lib/session";
if (isServer) dotenv.config()

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <State>
              <Routes>
                <FileRoutes />
              </Routes>
              <sup id="lp" class="tiny"><a href="https://liberapay.com/e/donate">Donate</a> • <a href="https://github.com/boehs/candas">Git</a></sup>
            </State>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
