const parseNumber = (input) => {
  const number = input.startsWith('n')
    ? -1 * Number(input.slice(1))
    : Number(input);

  if (isNaN(number)) {
    throw new Error(`${input} is not a number`);
  }

  return number;
};

const processBasicArithmeticExpression = (input) => {
  const elements = input.split(/(\+|\-|\*|\/)/).filter((e) => e.trim() !== '');

  if (elements[0] === '-') {
    elements[1] = `-${elements[1]}`;
    elements.shift();
  }

  if (elements[0] === '+') {
    elements.shift();
  }

  for (let index = 0; index < elements.length; index += 2) {
    elements[index] = parseNumber(elements[index]);
  }

  for (let index = 1; index < elements.length; index += 2) {
    if (elements[index] === '*') {
      const result = elements[index - 1] * elements[index + 1];
      elements.splice(index - 1, 3, result);
      index -= 2;
    } else if (elements[index] === '/') {
      const result = elements[index - 1] / elements[index + 1];
      elements.splice(index - 1, 3, result);
      index -= 2;
    }
  }

  for (let index = 1; index < elements.length; index += 2) {
    if (elements[index] === '+') {
      const result = elements[index - 1] + elements[index + 1];
      elements.splice(index - 1, 3, result);
      index -= 2;
    } else if (elements[index] === '-') {
      const result = elements[index - 1] - elements[index + 1];
      elements.splice(index - 1, 3, result);
      index -= 2;
    } else {
      throw new Error(`Invalid operator ${elements[index]}`);
    }
  }

  return elements[0];
};

const processParentheses = (input) => {
  let currentExpression = `(${input})`;

  const openingParenthesisStack = [];

  for (let index = 0; index < currentExpression.length; index++) {
    if (currentExpression[index] === '(') {
      openingParenthesisStack.push(index);
    } else if (currentExpression[index] === ')') {
      if (openingParenthesisStack.length === 0) {
        throw new Error(`Missing '('`);
      }

      let result = processBasicArithmeticExpression(
        currentExpression.slice(
          openingParenthesisStack[openingParenthesisStack.length - 1] + 1,
          index
        )
      );

      result = result < 0 ? `n${-1 * result}` : result.toString();

      currentExpression =
        currentExpression.slice(
          0,
          openingParenthesisStack[openingParenthesisStack.length - 1]
        ) +
        result +
        currentExpression.slice(index + 1);

      index =
        openingParenthesisStack[openingParenthesisStack.length - 1] +
        result.length -
        1;

      openingParenthesisStack.pop();
    }
  }

  if (openingParenthesisStack.length !== 0) {
    throw new Error(`Missing ')'`);
  }

  return parseNumber(currentExpression);
};

const processExpression = (input) => {
  const expression = input.replace(/\s/g, '').replace(/,/, '.');

  if (!/^[0-9\(\)\+\-\*\/\.]+$/.test(expression)) {
    throw new Error(`Invalid character(s)`);
  }

  return processParentheses(expression);
};

const input = document.querySelector('#input');
const errorOutput = document.querySelector('#error');
const resultOutput = document.querySelector('#result');

const outputResult = (e) => {
  e.preventDefault();

  try {
    const result = processExpression(input.value);

    errorOutput.value = '';
    resultOutput.value = result;
  } catch (error) {
    errorOutput.value = error.message;
    resultOutput.value = '';
  }
};

const allClear = (e) => {
  e.preventDefault();

  input.value = '';
};

const backSpace = (e) => {
  e.preventDefault();

  input.value = input.value.slice(0, -1);
};

const btnInput = (e) => {
  e.preventDefault();

  input.value += e.target.textContent;
};
