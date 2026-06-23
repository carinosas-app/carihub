'use strict';

const pricing = require('./pricing-resolver');
const entitlements = require('./entitlements-resolver');
const promo = require('./promo-resolver');
const contractFactory = require('./contract-factory');
const planMinimo = require('./plan-minimo');
const uploadGate = require('./upload-gate');

module.exports = {
  ...pricing,
  ...entitlements,
  ...promo,
  ...contractFactory,
  ...planMinimo,
  validateUpload: uploadGate.validateUpload,
};
