import 'dotenv/config';
import { authController } from './modules/auth/controller.js';
import { articlesController } from './modules/articles/controller.js';


import Fastify from 'fastify'
import {
    serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'

import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
await app.register(swagger, {
    openapi: {
        info: { title: 'tc-api', version: '0.1.0' },
    },
    transform: jsonSchemaTransform,
})

await app.register(swaggerUi, {
    routePrefix: '/docs'
})

await app.register(authController, { prefix: '/auth' });
app.get('/health', async () => ({ status: 'ok' }))
await app.register(articlesController, { prefix: '/articles' });


app.listen({ port: 3001 }, (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1)
    }
})


