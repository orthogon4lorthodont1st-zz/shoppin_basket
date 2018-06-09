const { items } = require('../constants');

module.exports = {
  converter: pence => `£${(pence / 100).toFixed(2)}`,

  parseArguments: cmdArgs => {
    const basketItems = cmdArgs.slice(2, cmdArgs.length);
    const errItems = [];

    basketItems.map(basketItem => {
      if (!items.includes(basketItem)) {
        errItems.push(basketItem);
      }
    });

    if (errItems.length > 0) {
      throw new Error(`The following items are not sold: ${errItems}`);
    }

    return basketItems;
  },
};
