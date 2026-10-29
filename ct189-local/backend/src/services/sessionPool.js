// Serialize a whole login transaction, including its account confirmation.
export function createSessionPool(createClient) {
  const clients = new Map();
  const queues = new Map();
  return {
    existing(id) { return clients.get(id); },
    async get(id) {
      if (!clients.has(id)) {
        const pending = Promise.resolve().then(() => createClient(id));
        clients.set(id, pending);
        pending.catch(() => { if (clients.get(id) === pending) clients.delete(id); });
      }
      return clients.get(id);
    },
    async close(id) {
      const pending = clients.get(id);
      if (!pending) return;
      try { await (await pending).context.close(); }
      finally { clients.delete(id); }
    },
    async run(id, task) {
      const previous = queues.get(id) || Promise.resolve();
      const current = previous.catch(() => {}).then(task);
      queues.set(id, current);
      try { return await current; }
      finally { if (queues.get(id) === current) queues.delete(id); }
    }
  };
}
