import { PrismaClient } from '@prisma/client'
import { Resolvers } from '../schema/resolvers-types'

export const resolvers: Resolvers = {
  Query: {
    statuses() {
      return listStatuses()
    },
    status(_parent, args) {
      return getStatus(args?.id) ?? null
    },
  },
  Mutation: {
    createStatus(_parent, { body }) {
      return createStatus(body)
    },
  },
}

const prisma = new PrismaClient()

const listStatuses = async () => {
  const statuses = await prisma.status.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return statuses.map((status) => ({
    ...status,
    createdAt: status.createdAt?.toISOString(),
  }))
}

const getStatus = async (id: string) => {
  const status = await prisma.status.findUnique({ where: { id: id } })

  return status
    ? { ...status, createdAt: status?.createdAt?.toISOString() }
    : null
}

const createStatus = async (body: string) => {
  const createdStatus = await prisma.status.create({
    data: {
      body: body,
    },
  })

  return {
    ...createdStatus,
    createdAt: createdStatus?.createdAt?.toISOString(),
  }
}
