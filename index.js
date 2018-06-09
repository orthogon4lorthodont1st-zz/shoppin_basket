#!/usr/bin/env node

const { priceList, percentageDiscount, discountTypes } = require('./constants');
const { parseArguments, converter } = require('./utils');

function calculateDiscount(basketItems) {
  let discount = 0;
  let reasons = [];

  const itemCount = basketItems.reduce((acc, item) => {
    if (!acc[item]) {
      acc[item] = 1;
    } else {
      acc[item] += 1;
    }

    return acc;
  }, {});

  if (itemCount.soup > 1 && itemCount.bread) {
    let numberOfDiscounts = 0;
    const potentialNumberOfDiscounts = Math.floor(itemCount.soup / 2);
    const numberOfBreads = itemCount.bread;

    if (potentialNumberOfDiscounts < numberOfBreads) {
      numberOfDiscounts = potentialNumberOfDiscounts;
    }

    if (potentialNumberOfDiscounts >= numberOfBreads) {
      numberOfDiscounts = numberOfBreads;
    }

    discount = numberOfDiscounts * percentageDiscount.bread * priceList.bread;

    reasons.push(`${discountTypes.soup} - ${converter(discount)}`);
  }

  if (itemCount.apples) {
    discount += itemCount.apples * priceList.apples * percentageDiscount.apples;

    reasons.push(
      `${discountTypes.apples} - ${converter(
        itemCount.apples * priceList.apples * percentageDiscount.apples,
      )}`,
    );
  }

  return {
    discount,
    reasons,
  };
}

function calculatePrice(basketItems) {
  return basketItems.reduce((sum, item) => sum + priceList[item], 0);
}

function processArgs(basketItems) {
  const { discount, reasons } = calculateDiscount(basketItems);

  return {
    subTotal: calculatePrice(basketItems),
    reasons,
    discount,
  };
}

function displayOnConsole(processedItems) {
  console.log(`Subtotal: ${converter(processedItems.subTotal)}`);
  if (processedItems.reasons.length === 0) {
    console.log('(No deals available)');
  } else {
    processedItems.reasons.forEach(type => {
      console.log(`Deal: ${type}`);
    });
  }
  console.log(
    `Total: ${converter(processedItems.subTotal - processedItems.discount)}`,
  );
}

function main() {
  try {
    const basketItems = parseArguments(process.argv);
    const processedItems = processArgs(basketItems);
    displayOnConsole(processedItems);
  } catch (err) {
    console.error(err);
  }
}

main();

module.exports = {
  calculatePrice,
  calculateDiscount,
};
