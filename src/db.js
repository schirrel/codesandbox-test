import Dexie from 'dexie'

const db = new Dexie('mais-precoce')

db.version(1).stores({
  farm: 'code, name, created, changed',
  simulation: 'code, farm, name, type, created, changed, active'
})

export default db
