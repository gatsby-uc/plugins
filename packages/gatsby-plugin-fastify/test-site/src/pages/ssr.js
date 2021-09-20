import * as React from "react"

export default function SsrExample({ serverData }) {
  return (
  <main>
    <h1>SSR Page with Dogs</h1>
    <img alt="Happy dog" src={serverData.message} />
  </main>
)}

export async function getServerData() {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/image/random`);
    if (!res.ok) {
      throw new Error(`Response failed`);
    }
    return {
      props: await res.json(),
    };
  } catch (error) {
    return {
      headers: {
        status: 500,
      },
      props: {},
    };
  }
}
