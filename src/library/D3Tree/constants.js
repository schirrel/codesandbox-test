
export const WIDTH = 1000
export const HEIGHT = 800

export const nodesType = {
  in: 1,
  out: 0
}

export const nodesTypeName = {
  in: 'Tratamento',
  out: 'Produção'
}

export const orientationTree = {
  top: {
    size: [WIDTH, HEIGHT],
    x: function (d) {
      return d.x
    },
    y: function (d) {
      return d.y
    }
  },
  right: {
    size: [HEIGHT, WIDTH],
    x: function (d) {
      return 0 - d.y
    },
    y: function (d) {
      return d.x
    }
  },
  bottom: {
    size: [WIDTH, HEIGHT],
    x: function (d) {
      return d.x
    },
    y: function (d) {
      return 0 - d.y
    }
  },
  left: {
    size: [HEIGHT, WIDTH],
    x: function (d) {
      return d.y
    },
    y: function (d) {
      return d.x
    }
  }
}

export const actionsType = {
  add: 'addNode',
  addIn: 'addNodeIn',
  addOut: 'addNodeOut',
  remove: 'removeNode',
  addBalance: 'addBalance',
  removeBalance: 'removeBalance',
  edit: 'editNode',
  undo: 'undo',
  redo: 'redo',
  save: 'save',
  reset: 'reset',
  config: 'config',
  children: 'children',
  mini: 'mini',
  orientation: 'orientation',
  nodeh: 'nodeh',
  nodew: 'nodew'
}

export const nodeTypes = {
  isIn: (node) => node === 'Tratamento' || node === 1,
  isOut: (node) => node === 'Produção' || node === 0,
  isTratamentoEntrada: (node) => node === 'Tratamento' || node === 1,
  isProducaoSaida: (node) => node === 'Produção' || node === 0
}

export const convertTypeToString = (value) => {
  switch (value) {
    case nodesType.in:
      return nodesTypeName.in
    case nodesType.out:
      return nodesTypeName.out
  }
}

export const colors = {
  producao: '#003399',
  tratamento: '#009933'
}
