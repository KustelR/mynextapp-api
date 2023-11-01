import Fastify from 'fastify'
import cors from '@fastify/cors'
import RoutesPlugin from './fplugins/routes.ts'


import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const ajv = addFormats(new Ajv({}), [
    'date-time', 
    'time', 
    'date', 
    'email',  
    'hostname', 
    'ipv4', 
    'ipv6', 
    'uri', 
    'uri-reference', 
    'uuid',
    'uri-template', 
    'json-pointer', 
    'relative-json-pointer', 
    'regex'
]).addKeyword('kind')
  .addKeyword('modifier')

export default function start() {
  const fastify = Fastify({
    logger: true
  }).withTypeProvider<TypeBoxTypeProvider>();
  fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return ajv.compile(schema);
  });
  fastify.register(RoutesPlugin);
  fastify.register(cors, {})
  
  fastify.listen({ port: 5000 }, function (err, address) {
  if (err) {
      fastify.log.error(err)
      process.exit(1)
  }
  // Server is now listening on ${address}
  })
}
