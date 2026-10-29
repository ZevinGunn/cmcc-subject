import path from 'node:path'
import { Store } from './store.js'
import { Client } from './client.js'
import { Engine } from './engine.js'
import { ownerDirectory, type Identity } from './access.js'

export class Contexts {
  private contexts = new Map<string, ReturnType<Contexts['create']>>()
  private gate = { busy: false }
  constructor(private dir: string) {}
  private create(identity: Identity) {
    const store = new Store(identity.kind === 'local' ? this.dir : path.join(this.dir, 'owners', ownerDirectory(identity.key)))
    const client = new Client(store)
    const context = { store, client, engine: null as unknown as Engine, verifyJob: undefined as undefined | (() => Promise<void>) }
    // Revalidate the original home session before each background transport call.
    const transport = new Proxy(client, { get(target, property) {
      const value = Reflect.get(target, property)
      if (typeof value !== 'function') return value
      return async (...args: unknown[]) => { await context.verifyJob?.(); return value.apply(target, args) }
    } })
    context.engine = new Engine(store, transport, this.gate)
    return context
  }
  get(identity: Identity) {
    let context = this.contexts.get(identity.key)
    if (!context) { context = this.create(identity); this.contexts.set(identity.key, context) }
    return context
  }
  close() { for (const c of this.contexts.values()) c.store.close() }
  stop() { for (const c of this.contexts.values()) for (const j of c.store.state.jobs) if (j.status === 'running') c.engine.stop(j) }
}
