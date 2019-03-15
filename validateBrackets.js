br = { ")": "(", "}": "{", "]": "[" }

const validateBrackets = (s) => {
  let stack = [], res = true     // Define variables
  s.split('').forEach(e => {     // For each element in string
    if (!e.match(/\)|\(|\[|\]|\{|\}/)) return
    
    if (e.match(/\)|}|]/)) {   // If element is a closing bracket
      if (stack.length === 0)  // If no items left in stack
        res = false            // Return false
      else if (br[e] !== stack.pop())  // Or if brackets don't match
        res = false
    } else stack.push(e)       // Ot just push to stack
  })
  
  if (stack.length !== 0) res = false  // If something left then result is false
  
  return res
}
