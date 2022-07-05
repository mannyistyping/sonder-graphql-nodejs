'use strict';

import Fastify  from 'fastify';
import mercurius from 'mercurius';
import {makeExecutableSchema,} from 'graphql-tools'
import {loadFiles} from '@graphql-tools/load-files'

const app = Fastify();

const schema = makeExecutableSchema({
  typeDefs: loadFiles('./src/schema/**/*.graphql'),
})

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
  },
};

app.register(mercurius, {
  schema,
  resolvers,
});

app.get('/', async function (_req, reply) {
  const query = '{ add(x: 2, y: 2) }';
  return reply.graphql(query);
});


const start = async () => {
  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()