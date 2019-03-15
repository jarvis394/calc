const priorities = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3
}

// Helpers
const isEmpty = (array) => !(typeof array !== "undefined" && array !== null && array.length !== null && array.length > 0)
const peek = (stack) => stack[stack.length - 1]
const comparePriority = (a, b) => priorities[a.value] > priorities[b.value]


/**
 * Calcultor based on postfix (RPN)
 */
class Calculator {
  
  /**
   * Checks if argument is an expression
   * @param {Any} exp Expression to check
   */
  isExpression(exp) {
    return exp || (exp && exp.length) || typeof exp === "string"
  }
  
  /**
   * Get result of calculation an infix string expression
   * @param {String} exp Expression
   */
  result(exp) {
    if (!this.isExpression(exp)) throw new Error("Unexpected input, expected String but found: " + exp)
    if (!validateBrackets(exp)) throw new Error("Brackets are not valid. Check your expression: " + exp)
    
    let tokenized = tokenize(exp)
    let converted = this.convert(tokenized)
    return this.calculate(converted)
  }
  
  /**
   * Calculates expression in postfix (RPN)
   * @param {Array} exp Expression (tokenized)
   */
  calculate(exp) {
    let stack = []
    
    exp.forEach(e => {
      
      // Number
      if (e.type === "Number") {
        stack.push(e.value)
      }
      
      // Operator
      else if (e.type === "Operator") {
        let o2 = stack.pop()
        let o1 = stack.pop()
        
             if (e.value == '+') stack.push(o1 + o2)
        else if (e.value == '-') stack.push(o1 - o2)
        else if (e.value == '/') stack.push(o1 / o2)
        else if (e.value == '*') stack.push(o1 * o2)
        else if (e.value == '^') stack.push(Array(parseInt(o2)).fill(parseInt(o1)).reduce((acc, e) => acc *= e))
      }
      
      // Function
      else if (e.type === "Function") {
        let args = []
        for (let i = 0; i < e.argsAmount; i++) {
          args.push(stack.pop())
        }
        
        stack.push(Math[e.value](...args))
      }
    })
    
    return stack[0]
  }
  
  /**
   * Converts infix to postfix expression (RPN)
   * @param {Array} exp Expression (tokenized)
   */
  convert(exp) {
    let operators = []
    let res = []
    
    exp.forEach(e => {
      
      // Number
      if (e.type === "Number") res.push(e)
      
      // Operator
      else if (e.type === "Operator") {
        while (!isEmpty(operators) && peek(operators) && peek(operators).type !== "Opening Parenthesis" && comparePriority(peek(operators), e)) {
          res.push(peek(operators))
          operators.pop()
        }
        
        operators.push(e)
      }
      
      // (
      else if (e.type === "Opening Parenthesis") {
        operators.push(e)
      }
      
      // )
      else if (e.type === "Closing Parenthesis") {
        while (!isEmpty(operators) && peek(operators).type !== "Opening Parenthesis") {
          res.push(peek(operators))
          operators.pop()
        }
        
        for (let i in operators) {
          if (operators[i].type === "Function") {
            res.push(operators[i])
            operators.splice(i, 1)
          }
        }
        
        operators.pop()
      }
      
      // Function
      else if (e.type === "Function") operators.push(e)
    })
    
    // Flush left operators
    while (!isEmpty(operators)) {
      res.push(peek(operators))
      operators.pop()
    }
    
    return res
  }
}