const pullData = require('../../pull-gharchive-minimized')

const onehour = 1000 * 60 * 60

const hours = function * (start, end) {
  start = (new Date(start)).getTime()
  end = (new Date(end)).getTime()
  while (start < end) {
    yield start
    start += onehour
  }
}

const defaults = { local: false, langs: true }

const pull = async (start, end, opts={}) => {
  opts = {...defaults, ...opts}
  const results = {
    margin: { missing: 0, null: 0 }
  }
  const set = (...args) => {
    let share = args.pop()
    let r = results
    let key
    let parent
    while (args.length) {
      key = args.shift()
      if (!r[key]) r[key] = args.length ? {} : 0
      parent = r
      r = r[key]
    }
    parent[key] += share
  }
  const add = (...args) => {
    const user = args.pop()
    let r = results
    while (args.length) {
      const key = args.shift()
      if (!r[key]) r[key] = args.length ? {} : new Set()
      r = r[key]
    }
    r.add(user)
  }

  for (const hour of hours(start, end)) {
    for await (const event of pullData(hour, opts)) {
      if (event.langs) {
        for (const [lang, share] of Object.entries(event.langs)) {
          set('events', lang, event.type, share)
          if (event.commits) set('commits', lang, event.commits * share)
          if (share >= .4) {
            add('people', lang, event.type, event.actor)
            add('repos', lang, event.type, event.repo)
          }
        }
      } else {
        if (event.langs === null) results.margin.null += 1
        else results.margin.missing += 1
      }
    }
  }
  const toArray = obj => {
    for (const [k, v] of Object.entries(obj)) {
      if (v instanceof Set) obj[k] = Array.from(v)
      else toArray(v)
    }
  }
  toArray(results.people)
  toArray(results.repos)
  return results
}

module.exports = pull
