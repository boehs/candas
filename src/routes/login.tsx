import { Show } from "solid-js";
import { A, useIsRouting } from "solid-start";
import Spinner from "~/components/spinner";

export default function Login() {
    const isRouting = useIsRouting()

    return <>
        <header>
            <h2>
                <A end={true} href="/">Candas</A>
                <Show when={isRouting()}>
                    <Spinner />
                </Show>
            </h2>
            <sup>By 🏕️ Humanity</sup>
        </header>
        <div id="content">
            <section class="sticky">
                <ul>
                    <li><span class="secondary">0</span>Login</li>
                </ul>
            </section>
            <main>
                <form>
                    <label for="instance">Instance</label>
                    <input name="instance" placeholder="brookline.instructure.com" />
                    <label for="key">API Key</label>
                    <input name="key" placeholder="1000~Jpn1yS3CylIMMJNFzNjbn1EuNg08IsYolPEspu6O2cGbaSBoMaAtgBhhjN8ZozC0" />
                    <input type="submit" value="Login to Candas" />

                </form>
            </main>
        </div>
    </>
}