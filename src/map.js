let tasks = {};

module.exports = {
  tasks: tasks,
  slug: slug,
  get: get,
  set: set,
  has: has,
  len: 0
}

function slug (title) {
  return title.replace(/\s/g, '-')
}

function get (name) {
  return tasks[slug(name)]
}

function set (name, task) {
  if (name.length > module.exports.len) {
    module.exports.len = name.length
  }
  tasks[slug(name)] = task
  return task
}

function has (name) {
  return !!get(name)
}
