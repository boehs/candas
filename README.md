# Candas

A fast frontend for Canvas that covers about 90% of common usecases in ~50% less loading time.

## Features

- vim-like keyboard bindings (`6a` for assignments in your 6th class)
- In testing, navigation was 50% faster (16s for a series of actions, vs 33s in canvas. Test yourself!). We have
  - Less JavaScript (3% of what canvas ships)
  - A big boost from those shortcuts
  - Courses always visible
  - Faster response times, despite the fact the API sends redundant information over the network AND needs to be proxied
- No-frills UI. Functional.
- Fixes some annoying things
  - Grades and assignments are in the same page
  - Percentages for assignments always
  - Colour coding for future assignments
- Does not care if your teacher disabled certain pages

Candas does *not* implement all of canvas, but makes it trivial to launch into canvas, should you need to, using the `c` shortcut. Current missing things that hinder my workflow: https://github.com/boehs/candas/labels/minor

## Problems

Candas technically violates the canvas TOS, as it does not follow the Oauth flow and instead relies on dev tokens. The Oauth flow requires administrator approval, which is both a problem and kinda a reinforcement of the big edtech problem: https://twitter.com/Jessifer/status/1318959090828267524

## Prior art

- [Clanvas](https://github.com/marklalor/clanvas): A TUI for Canvas
