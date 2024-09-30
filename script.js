// Provided state - Do not alter these variables
let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// Element selectors
const priceDisplay = document.getElementById('price');
const cashInput = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const changeDue = document.getElementById('change-due');
const totalCIDDisplay = document.getElementById('total-cid');

// Constants
const CUSTOMER_INSUFFICIENT_FUNDS_MSG = 'Customer does not have enough money to purchase the item';
const NO_CHANGE_DUE_MSG = 'No change due - customer paid with exact cash';
const currencySelectorMap = {
  PENNY: 'pennies',
  NICKEL: 'nickels',
  DIME: 'dimes',
  QUARTER: 'quarters',
  ONE: 'ones',
  FIVE: 'fives',
  TEN: 'tens',
  TWENTY: 'twenties',
  'ONE HUNDRED': 'hundreds'
};
const currencyDenominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];

// Additional state
let registerStatus = 'OPEN';
let changeAry = [];

const getTotalCID = () => parseFloat(cid.map(currencyData => currencyData[1]).reduce((acc, curr) => acc + curr, 0)).toFixed(2);

const calculateChange = () => {
  if (!cashInput.value) {
    return;
  }

  registerStatus = 'OPEN';
  changeAry = [];
  changeDue.innerHTML = '';
  const cashInputValue = Number(parseFloat(cashInput.value).toFixed(2));

  if (cashInputValue < price) {
    alert(CUSTOMER_INSUFFICIENT_FUNDS_MSG);
    updateUI();
    return;
  }

  if (cashInputValue === price) {
    changeDue.innerHTML = `<p>${NO_CHANGE_DUE_MSG}</p>`;
    updateUI();
    return;
  }

  const changeTotal = parseFloat((cashInputValue - price).toFixed(2));
  let changeDueToCustomer = changeTotal;
  const totalCID = Number(getTotalCID());

  if (totalCID < changeDueToCustomer) {
    changeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    updateUI();
    return;
  }

  if (totalCID === changeDueToCustomer) {
    registerStatus = 'CLOSED';
  }

  [...cid].reverse().forEach((currencyData, index) => {
    if (changeDueToCustomer > 0 && changeDueToCustomer >= currencyDenominations[index]) {
      let quantity = 0;
      let amountAvailable = currencyData[1];
      while (amountAvailable > 0 && changeDueToCustomer >= currencyDenominations[index]) {
        amountAvailable -= currencyDenominations[index];
        changeDueToCustomer = parseFloat((changeDueToCustomer - currencyDenominations[index]).toFixed(2));
        quantity++;
      }
      if (quantity > 0) {
        changeAry.push([currencyData[0], (quantity * currencyDenominations[index]).toFixed(2)]);
      }
    }
  });

  if (changeDueToCustomer > 0) {
    changeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    updateUI();
    return;
  }

  changeDue.innerHTML = `<p>Status: ${registerStatus}</p><p>Change due: $${changeTotal}</p>`;
  changeAry.forEach(currencyData => changeDue.innerHTML += `<p>${currencyData[0]}: $${currencyData[1]}</p>`)
  updateUI();
};

const updateUI = () => {
  cashInput.value = '';
  priceDisplay.textContent = `Price: $${price}`;

  if (changeAry.length) {
    changeAry.forEach(changeCurrencyData => {
      const cidCurrencyDataToUpdate = cid.find(cidCurrencyData => cidCurrencyData[0] === changeCurrencyData[0]);
      cidCurrencyDataToUpdate[1] = Math.round(cidCurrencyDataToUpdate[1] - changeCurrencyData[1]);
    });
  }

  totalCIDDisplay.textContent = `Total: ${getTotalCID()}`

  cid.forEach(currencyData => {
    const changeDrawerCurrencyToUpdate = document.getElementById(`cid-${currencySelectorMap[currencyData[0]]}`);
    changeDrawerCurrencyToUpdate.innerText = `$${currencyData[1].toFixed(2)}`;
  });
};

purchaseBtn.addEventListener('click', calculateChange);

cashInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    calculateChange();
  }
});

updateUI();
