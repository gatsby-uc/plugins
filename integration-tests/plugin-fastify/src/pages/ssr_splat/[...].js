import * as React from "react";
export default function SsrFallBackExample({ serverData }) {
  return (
    <main>
      <pre>{JSON.stringify(serverData.message, null, 2)}</pre>
    </main>
  );
}

export async function getServerData({ params }) {
  return {
    status: 200,
    props: {
      message: params,
    },
  };
}
