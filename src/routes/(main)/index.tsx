import { Title } from "solid-start";

export default function Home() {
  return <main>
    <Title>Home</Title>
    <h1>Home</h1>
    <p>Hey 👋, welcome to the Candas beta!</p>
    <p>Eventually, you will find a feed of all your upcoming assignments right here.
      <br/>
      For now, click on one of your classes (or, if you are feeling adventurous, hit a number!), and explore the new world
    </p>
    <h2>Known Bugs</h2>
    <ul>
      <li>Cold starts result in no table content rendering</li>
      <li>Can't Preview Assignments</li>
      <li>If date is unset, falls back to unix timestamp</li>
      <li>Grade not visible</li>
    </ul>
  </main>
}
