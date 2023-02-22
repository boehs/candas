import { Show } from "solid-js";
import { FormError } from "solid-start";
import { createServerAction$, redirect } from "solid-start/server";
import { storage } from "~/lib/session";

export default function Login() {
    const [_, { Form }] = createServerAction$(async (form: FormData) => {
        const instance = form.get('instance')
        const key = form.get('key')
        if (!instance || !key) throw new FormError('Missing information')
        const session = await storage.getSession()
        session.set('instance', instance)
        session.set('key', key)
        return redirect('/', {
            headers: {
                'Set-Cookie': await storage.commitSession(session)
            }
        })
    })

    return <div id="content">
        <section class="sticky">
            <ul>
                <li><span class="secondary">0</span>Login</li>
            </ul>
        </section>
        <main>
            <Form>
                <label for="instance">Instance</label>
                <input name="instance" placeholder="brookline.instructure.com" />
                <label for="key">API Key</label>
                <input name="key" placeholder="1000~Jpn1yS3CylIMMJNFzNjbn1EuNg08IsYolPEspu6O2cGbaSBoMaAtgBhhjN8ZozC0" />
                <input type="submit" value="Login to Candas" />
            </Form>
        </main>
    </div>
}