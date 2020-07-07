const readline = require('readline')
const Snake    = require('./snake')
const base     = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// mutable state
let State = Snake.initialState()

// matrix operations
const Matrix = {
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake:  state => pipe(...map(Matrix.set('X'))(state.snake)),
  addApple:  state => Matrix.set('o')(state.apple),
  addCrash:  state => state.snake.length == 0 ? map(map(k('#'))) : id,
  toString:  xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'),
  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
  )(state)
}

// key events
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit()
  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP':    State = Snake.enqueue(State, Snake.NORTH); break
    case 'A': case 'H': case 'LEFT':  State = Snake.enqueue(State, Snake.WEST);  break
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, Snake.SOUTH); break
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST);  break
  }
});

// game loop
const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State)))
const step = () => State = Snake.next(State)

// main
setInterval(() => { step(); show() }, 80)