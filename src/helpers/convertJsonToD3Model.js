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

// const flatTree = (node, isRoot) => {
//   if (isRoot) {
//     if (node.children?.length) {
//       const result = node.children.map(each => {
//         return flatTree(each, false)
//       })
//       console.log('result', result)
//       return result
//     } else {
//       const r = {
//         ...node
//       }
//       console.log('return', r)
//       return r
//     }
//   } else {
//     if (node.child.children?.length) {
//       const result = node.child.children.map(each => {
//         return flatTree(each, false)
//       })
//       console.log('result', result)
//       return result
//     } else {
//       const r = {
//         ...node.child,
//         flow: node.flow
//       }
//       console.log('return', r)
//       return r
//     }
//   }
//   // if (isRoot ? node.children?.length : node.child.children?.length) {
//   //   const result = isRoot ? node.children.forEach(flatTree) : node.child.children.forEach(flatTree)
//   //   console.log('flatTree result', result)
//   // } else {
//   //   console.log('flatTree else', node)
//   // }
//   // const flatNode = {
//   //   flow: node.flow
//   // }
//   // isRoot ? Object.assign(flatNode, node) : Object.assign(flatNode, node.child)
//   // return flatNode
// }

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
