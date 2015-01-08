var tasks = {};

module.exports = {
  tasks: tasks,
  get: get,
  set: set,
  has: has,
  slug: slug,
  len: 0
};

function get (name) {
  return tasks[slug(name)];
}

function set (name, task) {
  if (name.length > module.exports.len) {
    module.exports.len = name.length;
  }

  return tasks[slug(name)] = task;
}

function slug (title) {
  return title.replace(/\s/g, '-');
}

function has (name) {
  return !!get(name);
}
