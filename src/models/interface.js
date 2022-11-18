export class PmpNode {
  constructor (options) {
    this.code = options.code
    this.name = options.code
    this.formula = options.code
    this.description = options.code
    this.stage = options.code
  }
}

export class PmpFlow {
  constructor (options) {
    this.type = options.type
    this.formula = options.formula
    this.nodeIn = options.nodeIn
    this.nodeOut = options.nodeOut
    this.resource = options.resource
  }
}

export class PmpD3Node extends PmpNode {
  constructor (options) {
    super(options)
    this.children = options.children
    this.flow = options.flow
  }
}
