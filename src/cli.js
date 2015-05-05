import {green, white, cyan, bold, white, grey, green} from 'chalk'
import meow from 'meow'
import map from './map'

let help = `
  ${green('Usage')} \n
  ${white('  node <filename> ')} ${cyan('<tasks> ')} ${bold('<params>')}\n
  ${bold('  -h --help  ')} + ${white('- displays instructions')}
  ${bold('  -l --list  ')} + ${white('- displays available tasks')}
  ${bold('  -w --watch ')} + ${white('- watches files')}
`

let cmd = meow({
    pkg: '../package.json',
    help: help
}, { alias: {h: 'help', v: 'version', l: 'list', w: 'watch'},
     boolean: ['list', 'watch']
})

let {input, flags} = cmd

flags.list ? list() : pick()

function list () {
  console.log(bold.green('  Tasks \n'))
  var key, tasks = map.tasks
  for (key in tasks) {
    if (tasks.hasOwnProperty(key)) {
      console.log(grey('  ❯'), bold(key))
    }
    console.log('')
  }
}

function pick () {
  if (!input.length) {
    if (map.has('default')) {
      return run(map.get('default'))
    } else {
      return cmd.showHelp()
    }
  }

  input.forEach(function (key) {
    var t = map.get(key)

    if (!t) {
      return
    }
    run(t)
  })
}

function run (t) {
  t.params = flags
  t.run(flags.watch)
}
