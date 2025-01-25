import { Slot } from "expo-router";
import Head from "expo-router/head";
import "../global.css";

export default function Layout() {
  return (
    <>
      <Head>
        <title>Expo App Clip search</title>
      </Head>
      <Slot />
    </>
  );
}
