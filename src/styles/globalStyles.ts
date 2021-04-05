import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Source Sans Pro", Arial, sans-serif;
    overflow-x: hidden;
  }
  html {
    scroll-behaviour: smooth;
  }
  h1 {
    font-weight: 400;
    font-size: 2.48832em;
  }
`

export default GlobalStyle;