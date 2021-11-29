import * as React from "react";

export default function SsrExample({ serverData }) {
  return (
    <main>
      <h1>This should never render</h1>
    </main>
  );
}

export async function getServerData() {
  throw new Error("This is a bad error");
}
