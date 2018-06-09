'use strict';

const chai = require('chai');
const { converter, parseArguments } = require('../utils');
const {
  priceList,
  percentageDiscount,
  discountTypes,
} = require('../constants');
const { calculatePrice, calculateDiscount } = require('../index');
const { expect } = chai;

describe('#Shopping basket Tests', () => {
  describe('#Shopping Basket Utils', () => {
    it('should convert pence to pounds with correct decimals (1)', done => {
      const pence = 120;
      expect(converter(pence)).to.eq('£1.20');
      done();
    });

    it('should convert pence to pounds with correct decimals (2)', done => {
      const pence = 32001;
      expect(converter(pence)).to.eq('£320.01');
      done();
    });

    // The first 2 arguments are executable path and current .js path.
    // These are the default entries of process.argv array
    it('should throw an error if any invalid arguments are passed', done => {
      const defaultArgs = ['pathArg1', 'pathArg2'];
      const args = defaultArgs.concat(['bread', 'milk']);
      const invalidArgs = ['cheese', 'wine'];

      expect(() => {
        parseArguments(args.concat(invalidArgs));
      }).to.throw(`The following items are not sold: ${invalidArgs}`);

      done();
    });

    it('should return an array of the arguments passed in if all are valid', done => {
      const defaultArgs = ['pathArg1', 'pathArg2'];
      const args = ['bread', 'bread', 'milk', 'soup', 'soup', 'apples'];
      expect(parseArguments(defaultArgs.concat(args))).to.eql(args);
      done();
    });
  });

  describe('#Shopping Basket Calculations', () => {
    it('should calculate the Subtotal of items', done => {
      const items = ['bread', 'milk', 'soup', 'soup'];
      const price =
        priceList.bread + priceList.milk + priceList.soup + priceList.soup;
      expect(calculatePrice(items)).to.eq(price);
      done();
    });

    it('should calculate the Subtotal of items', done => {
      const items = ['bread', 'milk', 'apples', 'apples'];
      const price =
        priceList.bread + priceList.milk + priceList.apples + priceList.apples;
      expect(calculatePrice(items)).to.eq(price);
      done();
    });

    it('should calculate the correct discount for apples', done => {
      const items = ['apples', 'apples', 'milk'];
      const discount = 2 * percentageDiscount.apples * priceList.apples;

      expect(calculateDiscount(items).discount).to.eq(discount);
      expect(calculateDiscount(items).reasons).to.eql([
        `${discountTypes.apples} - ${converter(discount)}`,
      ]);

      done();
    });

    it('should caluclate to the correct discount for soup (1)', done => {
      const items = ['soup', 'soup', 'bread'];
      const discount = percentageDiscount.bread * priceList.bread;

      expect(calculateDiscount(items).discount).to.eq(discount);
      expect(calculateDiscount(items).reasons).to.eql([
        `${discountTypes.soup} - ${converter(discount)}`,
      ]);

      done();
    });

    it('should caluclate to the correct discount for soup (2)', done => {
      const items = ['soup', 'soup', 'soup', 'soup', 'bread'];
      const discount = percentageDiscount.bread * priceList.bread;

      expect(calculateDiscount(items).discount).to.eq(discount);
      expect(calculateDiscount(items).reasons).to.eql([
        `${discountTypes.soup} - ${converter(discount)}`,
      ]);

      done();
    });

    it('should caluclate to the correct discount for soup (3)', done => {
      const items = ['soup', 'soup', 'bread', 'bread', 'bread'];
      const discount = percentageDiscount.bread * priceList.bread;

      expect(calculateDiscount(items).discount).to.eq(discount);
      expect(calculateDiscount(items).reasons).to.eql([
        `${discountTypes.soup} - ${converter(discount)}`,
      ]);

      done();
    });

    it('should caluclate to the correct discount for soup (4)', done => {
      const items = [
        'soup',
        'soup',
        'soup',
        'soup',
        'soup',
        'soup',
        'bread',
        'bread',
        'bread',
      ];
      const discount = 3 * percentageDiscount.bread * priceList.bread;

      expect(calculateDiscount(items).discount).to.eq(discount);
      expect(calculateDiscount(items).reasons).to.eql([
        `${discountTypes.soup} - ${converter(discount)}`,
      ]);

      done();
    });
  });
});
