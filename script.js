let currentInput = '';
let previousInput = '';
let operator = null;

const currentOperandDisplay = document.getElementById('current-operand');
const previousOperandDisplay = document.getElementById('previous-operand');

function updateDisplay() {
    currentOperandDisplay.innerText = currentInput || '0';
    previousOperandDisplay.innerText = previousInput;
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    // Prevent multiple leading zeros unless it's "0."
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    // Handling parentheses as operators/scients
    if (op === '(' || op === ')') {
        currentInput += op;
        updateDisplay();
        return;
    }

    // Handle % separately or as an operator depending on logic
    // Here treating % as modulo or percentage. Let's stick to standard operator
    if (currentInput === '' && op === '-') {
        // Allow negative numbers at start
        currentInput = '-';
        updateDisplay();
        return;
    }
    
     if (currentInput === '') return;
     
     // Allow checking constraints
     currentInput += ' ' + op + ' ';
     updateDisplay();
}

function appendConstant(constName) {
    if (constName === 'pi') {
        currentInput += Math.PI.toFixed(8);
    } else if (constName === 'e') {
        currentInput += Math.E.toFixed(8);
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.toString().endsWith(' ')) {
        currentInput = currentInput.slice(0, -3); // remove " + " 
    } else {
        currentInput = currentInput.toString().slice(0, -1);
    }
    updateDisplay();
}

function calculateScientific(func) {
    if (currentInput === '') return;
    
    // Evaluate current expression first if it's complex, or just take the number
    // Ideally user inputs "sin(30)", but for immediate execution style:
    // Let's implement immediate execution for scientific functions on the current number
    
    let value;
    try {
        // We'll try to eval the current input to get a number to operate on
        // This handles cases like "2+2" -> then press "sin" -> sin(4)
        value = safeEval(currentInput);
    } catch {
        // If current input is incomplete expression
        return; 
    }

    let result;
    switch (func) {
        case 'sin':
            // JS Math.sin uses radians. Convert degrees to radians for standard calcs?
            // Usually scientific calcs have a DEG/RAD switch. Defaulting to Radians as is standard in Math.sin
            // But for general users, Degrees is often expected. Let's do Radians for now or add a toggle.
            // Let's stick to standard Math (Radians) for simplicity unless requested.
            result = Math.sin(value);
            break;
        case 'cos':
            result = Math.cos(value);
            break;
        case 'tan':
            result = Math.tan(value);
            break;
        case 'log':
            result = Math.log10(value);
            break;
        case 'ln':
            result = Math.log(value);
            break;
        case 'sqrt':
            if (value < 0) {
                currentInput = 'Error';
                updateDisplay();
                return;
            }
            result = Math.sqrt(value);
            break;
        case 'pow':
            // For power, we need two operands. This immediate mode doesn't fit well.
            // Alternative: Add "^" operator to expression.
            currentInput += ' ** '; // JS uses ** for power
            updateDisplay();
            return; // Return early, not a direct calculation
        case 'fact':
             if (value < 0 || !Number.isInteger(value)) {
                 result = 'Error';
             } else {
                 result = factorial(value);
             }
             break;
    }
    
    currentInput = result.toString();
    updateDisplay();
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let f = 1;
    for (let i = 2; i <= n; i++) f = f * i;
    return f;
}

function calculateResult() {
    try {
        // Replace visual operators with JS operators
        // x -> *
        // ÷ -> /
        // ^ -> ** (already handled in pow check if we used it, but let's be safe)
        // sin, cos etc need to be parsed if we allow typing them. 
        // But our UI puts them immediately.
        
        // Handling basic expression evaluation
        // Security note: safeEval is better, but for this context basic eval with replacement
        
        let expression = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
            
        // Catch incomplete expressions
        if (expression.endsWith(' ')) return;
        
        const result = eval(expression); // Using eval for simplicity in this constrained environment
        
        if (result === Infinity || isNaN(result)) {
            currentInput = 'Error';
        } else {
            currentInput = result.toString();
            previousInput = currentInput; // Store result
        }
    } catch (error) {
        currentInput = 'Error';
    }
    updateDisplay();
}

// Simple helper to evaluate basic math before applying function
function safeEval(input) {
     let expression = input
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
     return eval(expression);
}
