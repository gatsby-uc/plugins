import * as React from "react";
export default function SsrFallBackExample({ serverData }) {
  return <main>{serverData.message}</main>;
}

export async function getServerData({ params }) {
  return {
    status: 200,
    props: {
      message: params["slug"] === "42" ? "meaning of life" : "try again",
    },
  };
}
