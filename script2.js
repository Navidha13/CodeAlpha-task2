const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

function updateDisplay(){
  resultEl.textContent = current;
  if (operator && previous !== null){
    expressionEl.textContent = `${previous} ${opSymbols[operator]}`;
  } else {
    expressionEl.textContent = '\u00A0';
  }
}

function inputDigit(d){
  if (justEvaluated){
    current = d === '.' ? '0.' : d;
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if (d === '.' && current.includes('.')) return;
  if (current === '0' && d !== '.'){
    current = d;
  } else {
    if (current.length >= 14) return;
    current += d;
  }
  updateDisplay();
}

function compute(a, b, op){
  a = parseFloat(a);
  b = parseFloat(b);
  let r;
  switch(op){
    case 'add': r = a + b; break;
    case 'subtract': r = a - b; break;
    case 'multiply': r = a * b; break;
    case 'divide': r = b === 0 ? NaN : a / b; break;
    default: r = b;
  }
  if (Number.isNaN(r)) return 'Error';
  return parseFloat(r.toFixed(10)).toString();
}

function setOperator(op){
  if (operator && previous !== null && !justEvaluated){
    previous = compute(previous, current, operator);
    current = previous;
  } else {
    previous = current;
  }
  operator = op;
  justEvaluated = false;
  current = '0';
  updateDisplay();
}

function equals(){
  if (operator === null || previous === null) return;
  current = compute(previous, current, operator);
  operator = null;
  previous = null;
  justEvaluated = true;
  updateDisplay();
}

function clearAll(){
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function backspace(){
  if (justEvaluated) { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function percent(){
  current = (parseFloat(current) / 100).toString();
  updateDisplay();
}

document.querySelectorAll('button[data-num]').forEach(btn=>{
  btn.addEventListener('click', ()=> inputDigit(btn.dataset.num));
});

document.querySelectorAll('button[data-action]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const action = btn.dataset.action;
    if (['add','subtract','multiply','divide'].includes(action)){
      setOperator(action);
    } else if (action === 'equals'){
      equals();
    } else if (action === 'clear'){
      clearAll();
    } else if (action === 'backspace'){
      backspace();
    } else if (action === 'percent'){
      percent();
    }
  });
});

window.addEventListener('keydown', (e)=>{
  if (e.key >= '0' && e.key <= '9'){ inputDigit(e.key); return; }
  if (e.key === '.'){ inputDigit('.'); return; }
  if (e.key === '+'){ setOperator('add'); return; }
  if (e.key === '-'){ setOperator('subtract'); return; }
  if (e.key === '*'){ setOperator('multiply'); return; }
  if (e.key === '/'){ e.preventDefault(); setOperator('divide'); return; }
  if (e.key === 'Enter' || e.key === '='){ e.preventDefault(); equals(); return; }
  if (e.key === 'Backspace'){ backspace(); return; }
  if (e.key === 'Escape'){ clearAll(); return; }
  if (e.key === '%'){ percent(); return; }
});

updateDisplay();
