import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Don't Panic!</h1>
      <p>Whatever you're looking for, it's not here</p>
      <figure>
      <img src="https://media.tenor.com/YRSc87-d1yEAAAAi/peachandgoma.gif"/>
      <figcaption>Ok, maybe panic a <i>little</i> bit</figcaption>
      </figure>
    </main>
  );
}
