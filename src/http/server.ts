import { env } from '../env'

import fastify from 'fastify'
import z from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createGoal } from '../functions/create-goal'

const app = fastify().withTypeProvider<ZodTypeProvider>()
const port = env.PORT

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async request => {
    const {
			title,
			desiredWeeklyFrequency
		} = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app
  .listen({
    port: Number.parseInt(port),
  })
  .then(() => {
    console.log(`Server listening to ${port}`)
  })
