const endpoint = `https://${process.env.ENDPOINT}/api/graphql`

let config = {
  schema: {
  },
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  emitLegacyCommonJSImports: false,
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};
config.schema[endpoint] = {
  headers: {
    Authorization: process.env.AUTH
  }
}

export default config;