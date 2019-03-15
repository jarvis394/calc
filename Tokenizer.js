class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

class FunctionToken extends Token {
  constructor(type, value) {
    super(type, value)
    this.argsAmount = Math[value].length
  }
}

const isDigit = (c) => /\d/.test(c)
const isPoint = (c) => c === '.'
const isLetter = (c) => /[a-z]/.test(c)
const isSeparator = (c) => c === ','
const isOperator = (c) => /\+|-|\*|\/|\^/.test(c)
const isOpeningParenthesis = (c) => c === '('
const isClosingParenthesis = (c) => c === ')'

let digitsBuffer = []
let lettersBuffer = []

/**
 * Tokenize expression
 * @param {String} s Expression as String
*/
function tokenize(s) {
  s = s.replace(/\s+/g, '').split('') // Remove all spaces
  
  let res = []
  s.forEach((c, i) => {
    
    // If char is a digit like "9, 4" or a decimal point
    if (isDigit(c) || isPoint(c)) {
      digitsBuffer.push(c)
    }
    
    // If char is a letter, like "x, y, z"
    else if (isLetter(c)) {
      if (digitsBuffer.length) {
        flushDigits()
        res.push(new Token("Operator", "*"))
      }
      
      lettersBuffer.push(c)
    }
    
    // If char is a separator like "," in "min(1, 5)"
    else if (isSeparator(c)) {
      flushDigits()
      flushLetters()
      
      res.push(new Token("Separator", c))
    }
    
    // If char is an operator like "*, -, +, /, ^"
    else if (isOperator(c)) {
      flushDigits()
      flushLetters()
      
      res.push(new Token("Operator", c))
    }
    
    // If char is an opening parenthesis like "("
    else if (isOpeningParenthesis(c)) {
      
      // If letters buffer is not empty
      if (lettersBuffer.length) {
        
        // Push new function like "sin, cos, min"
        res.push(new FunctionToken("Function", lettersBuffer.join("")))
        lettersBuffer = []
      }
      
      // Or if digits buffer is not empty
      else if (digitsBuffer.length) {
        
        // Flush buffer and push a multiply operator
        flushDigits()
        res.push(new Token("Operator", "*"))
      }
      
      // Push "("
      res.push(new Token("Opening Parenthesis", c))
    }
    
    // If char is a closing parenthesis like ")"
    else if (isClosingParenthesis(c)) {
      flushDigits()
      flushLetters()
      
      res.push(new Token("Closing Parenthesis", c))
    }
    
    // Throw an error in any other case
    else throw new Error(`Unexpected symbol in '${s.join('')}' on index ${i + 1}: '${c}'`)
  })
  
  // Finishing touches
  if (digitsBuffer.length) flushDigits()
  if (lettersBuffer.length) flushLetters()
  
  return res
  
  function flushLetters() {
    lettersBuffer.forEach((e, i) => {
      
      // Variables are only 1 letter length
      res.push(new Token("Variable", e))
      
      // Push multiply opeartor ( should be like "x*y" )
      if (i < lettersBuffer.length - 1) {
        res.push(new Token("Operator", "*"))
      }
    })
    
    lettersBuffer = []
  }
  
  function flushDigits() {
    if (digitsBuffer.length) {
      
      // 4, 7, ., 8 is 47.8
      res.push(new Token("Number", parseInt(digitsBuffer.join(""))))
      digitsBuffer = []
    }
  }
}
