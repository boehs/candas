import { Title } from "solid-start";

export default function Home() {
  return <main>
    <Title>Home</Title>
    <h1>Home</h1>
    <p>Hello there 👋, welcome to the Candas beta!</p>
    <p>Eventually, you will find a feed of all your upcoming assignments right here.
      <br/>
      For now, click on one of your classes (or, if you are feeling adventurous, hit a number!), and explore the new world
    </p>
    <h2>To-Do</h2>
    <ul>
      <li>Cold starts result in no table content rendering</li>
      <li>If date is unset, falls back to unix timestamp</li>
      <li>Can't submit from assignments</li>
      <li>More <i>view in Canvas</i> buttons</li>
      <li>This page</li>
      <li>Auth</li>
      <li>More responsiver</li>
      <li>Term filters</li>
    </ul>
  </main>
}
