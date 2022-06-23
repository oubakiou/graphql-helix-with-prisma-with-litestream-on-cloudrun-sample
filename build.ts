import { exec } from 'child_process'
import graphqlLoaderPlugin from '@luckycatfactory/esbuild-graphql-loader'
import { build } from 'esbuild'

const isDevelopment = process.env.NODE_ENV === 'development'

try {
  build({
    entryPoints: ['src/index.ts'],
    outfile: 'index.js',
    bundle: true,
    minify: !isDevelopment,
    platform: 'node',
    target: 'node18',
    plugins: [graphqlLoaderPlugin()],
    watch: isDevelopment && {
      onRebuild(err, result) {
        if (err) {
          console.error('rebuild failure', err)
          return
        }

        exec('npm run gen')
        console.log('rebuild success', result)
      },
    },
  })
} catch (e) {
  console.error(e)
  process.exit(1)
}
