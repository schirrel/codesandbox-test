const getNode = (code, data) => {
  return data.node.find(node => node.code === code)
}

const generateChildren = (data) => {
  data.flow.forEach(flow => {
    const parent = getNode(flow.nodeIn, data)
    parent.children = parent.children || []
    const child = getNode(flow.nodeOut, data)
    child.hasParent = true
    parent.children.push({
      node: child,
      flow
    })
  })
  return data
}

const flatTree = (data) => {
  if (data.node.children?.length) {
    data.node.children = data.node.children.map(child => {
      return flatTree(child)
    })
  }
  return {
    ...data.node,
    flow: data.flow
  }
}

export const mountTree = (data) => {
  data = generateChildren(data)
  const root = data.node.find(node => !node.hasParent)
  data = flatTree({ node: root }, true)
  return data
}
