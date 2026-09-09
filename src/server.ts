import { authController } from './modules/auth/controller.js';
import { articlesController } from './modules/articles/controller.js';
import { env } from './env.js';

import Fastify from 'fastify'
import {
    serializerCompiler,
    validatorCompiler,
    jsonSchemaTransform,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'

import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export function buildApp() {
    const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()
    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)
    app.register(swagger, {
        openapi: {
            info: { title: 'tc-api', version: '0.1.0' },
        },
        transform: jsonSchemaTransform,
    })

    app.register(swaggerUi, {
        routePrefix: '/docs'
    })

    app.register(authController, { prefix: '/auth' });
    app.get('/health', async () => ({ status: 'ok' }))
    app.register(articlesController, { prefix: '/articles' });

    return app

}


if (import.meta.url == `file://${process.argv[1]}`) {
    const app = buildApp()
    app.listen({ port: env.TC_API_PORT }, (err: Error | null) => {
        if (err) {
            app.log.error(err);
            process.exit(1)
        }
    })


}

