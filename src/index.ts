import { createServer } from 'http'
import { URL, URLSearchParams } from 'url'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getGraphQLParameters, processRequest, sendResult } from 'graphql-helix'
import typeDefs from '../schema/typeDefs.graphql'
import { resolvers } from './resolvers'

// @see https://github.com/contra/graphql-helix/blob/main/examples/http/server.ts
const server = createServer((req, res) => {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`)
  const searchParams = new URLSearchParams(url.search)

  if (url.pathname !== '/graphql') {
    res.writeHead(404, {
      'content-type': 'text/plain',
    })
    res.end('Not found')
    return
  }

  let payload = ''

  req.on('data', (chunk) => {
    payload += chunk.toString()
  })

  req.on('end', async () => {
    const request = {
      body: JSON.parse(payload || '{}'),
      headers: req.headers,
      method: req.method ?? '',
      query: Object.fromEntries(searchParams),
    }

    const { operationName, query, variables } = getGraphQLParameters(request)

    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    })

    if (result.type === 'RESPONSE') {
      sendResult(result, res)
    } else {
      console.log('Not Implemented')
    }
  })
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`)
})
