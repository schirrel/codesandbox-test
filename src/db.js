import Dexie from 'dexie'

const db = new Dexie('%GENESIS_PROJECT_UNIX%')

db.version(1).stores({
  farm: 'code, name, created, changed',
  simulation: 'code, farm, name, type, created, changed, active'
})

export default db
