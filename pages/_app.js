import "../styles/globals.css";
import Header from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header>
        <title>Draft Item</title>
      </Header>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
