import { PrismaClient } from '@prisma/client'
import { loadRuntimeConfig } from './runtimeConfig.js'

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!prisma) {
    loadRuntimeConfig()
    prisma = new PrismaClient({
      log:
        process.env.PRISMA_LOG?.trim() === '1'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    })
  }
  return prisma
}
