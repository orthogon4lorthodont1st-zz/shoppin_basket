#!/usr/bin/env node

const { priceList, percentageDiscount, discountTypes } = require('./constants');
const { parseArguments, converter } = require('./utils');

/**
 * @param {<Array>} basketItems List of items in basket
 *
 * The discount is calculated based on the following deals:
 * 10% off for Apples
 * Buy 2 Soup get Bread half price, where 2 Soups gives 1 Bread item 50% off,
 * 4 Soups gives 2 Bread items 50% off etc..
 *
 * @returns {<Object>} The discount and deals
 */
function calculateDiscount(basketItems) {
  let discount = 0;
  let deals = [];

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

    deals.push(`${discountTypes.soup} - ${converter(discount)}`);
  }

  if (itemCount.apples) {
    discount += itemCount.apples * priceList.apples * percentageDiscount.apples;

    deals.push(
      `${discountTypes.apples} - ${converter(
        itemCount.apples * priceList.apples * percentageDiscount.apples,
      )}`,
    );
  }

  return {
    discount,
    deals,
  };
}

/**
 * @param {<Array>} basketItems List of items in basket
 *
 * @returns {<Number>} The subtotal of items in basket
 */
function calculatePrice(basketItems) {
  return basketItems.reduce((sum, item) => sum + priceList[item], 0);
}

function displayData(processedData) {
  console.log(`Subtotal: ${converter(processedData.subTotal)}`);
  if (processedData.deals.length === 0) {
    console.log('(No deals available)');
  } else {
    processedData.deals.forEach(type => {
      console.log(`Deal: ${type}`);
    });
  }
  console.log(
    `Total: ${converter(processedData.subTotal - processedData.discount)}`,
  );
}

function main() {
  try {
    const basketItems = parseArguments(process.argv);
    const { discount, deals } = calculateDiscount(basketItems);
    const subTotal = calculatePrice(basketItems);

    displayData({
      subTotal,
      deals,
      discount,
    });
  } catch (err) {
    console.error(err);
  }
}

main();

// Export these functions to be tested
module.exports = {
  calculatePrice,
  calculateDiscount,
};
