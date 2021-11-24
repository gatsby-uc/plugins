import * as React from "react"

export default function Ssr403Example({ serverData }) {
  return (
    <main>
      <h1>403 SSR Page</h1>
      <pre>{JSON.stringify(serverData, null, 2)}</pre>
    </main>
  )
}

export async function getServerData({ url, query, method, params, headers }) {
  return {
    status: 403,
    props: {},
  }
}
