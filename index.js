'use strict'

const debounce = (func, threshold, isImmediate) => {
  let timeout;
  let isExecuting;
  const _this = this;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      isExecuting = false;
      if(!isImmediate) {
        func.apply(_this, args);
      }
    }, threshold);
    if(!isExecuting && isImmediate) {
      func.apply(_this, args);
    }
    isExecuting = true;
  }
}


const keyDownHandler = (e) => {
  validateInput(e.target.value);
}

const outputNode = document.querySelector("#output");
const inputNode = document.querySelector("#input");

inputNode.addEventListener('keydown', debounce(keyDownHandler, 500));

const arr = [7000, 7001, 7002, 7003, -7004, 7005];

const multiInputRegex = /^((\+|-{0,1})\d+(,(\+|-{0,1})\d+)*)?$/;
const rangeInputRegex = /^(?!.*[A-Za-z]-[A-Za-z])(-|\+{0,1})([0-9])+(-{1}(-|\+{0,1})[0-9]+)?$/;


const arrHashMap = arr.reduce((acc, item) => {
  acc[item] = true;
  return acc;
},{});

const validateInput = (input) => {
  if(input.match(multiInputRegex)) {
    const duplicates = findDuplicatesByCSV(input);
    console.log(duplicates);
    outputNode.classList.remove('text-red');
    inputNode.classList.remove('text-input-error')
    outputNode.innerHTML = duplicates.length ? "Duplicates " + duplicates : "";
  } else if(input.match(rangeInputRegex)) {
    const duplicates = getDuplicatesByRange(input);
    console.log(duplicates);
    outputNode.classList.remove('text-red');
    inputNode.classList.remove('text-input-error')
    outputNode.innerHTML = duplicates.length ? "Duplicates " + duplicates : "";
  } else {
    outputNode.classList.add('text-red');
    inputNode.classList.add('text-input-error')
    outputNode.innerHTML = "Please enter a valid input";
  }
}

const findDuplicatesByCSV = (input) => {
  const inputArr = input.split(',');
  const duplicates = [];
  inputArr.forEach((item) => {
    if(arrHashMap[item]) {
      duplicates.push(item);
    }
  });
  return duplicates;
}

const getDuplicatesByRange = (input) => {
  const inputArr = input.split('-');
  let lowerVal;
  let upperVal
  if(inputArr.length === 4) {
    lowerVal = -parseInt(inputArr[1]);
    upperVal = -parseInt(inputArr[3]);
  }
  if(inputArr.length === 3) {
    if(inputArr[0] === '') {
      lowerVal = -parseInt(inputArr[1]);
      upperVal = parseInt(inputArr[2]);
    }
    if(inputArr[1] === '') {
      lowerVal = parseInt(inputArr[0]);
      upperVal = -parseInt(inputArr[2]);
    }
  }
  if(inputArr.length === 2) {
    lowerVal = parseInt(inputArr[0]);
    upperVal = parseInt(inputArr[1]);
  }

  if(lowerVal > upperVal) {
    outputNode.classList.add('text-red');
    inputNode.classList.add('text-input-error')
    outputNode.innerHTML = "Range must be in ascending order";
    throw Error('Range must be in ascending order');
  }

  const duplicates = [];

  for(let i = lowerVal; i <= upperVal; i++) {
    if(arrHashMap[i]) {
      duplicates.push(i);
    }
  }
  return duplicates;
}
