'use strict';

const pricing = require('./pricing-resolver');
const entitlements = require('./entitlements-resolver');
const promo = require('./promo-resolver');
const contractFactory = require('./contract-factory');
const planMinimo = require('./plan-minimo');
const uploadGate = require('./upload-gate');
const validateOrden = require('./validate-orden-schema');
const slotInventory = require('./slot-inventory');
const persistOrden = require('./persist-orden');
const activationService = require('./activation-service');
const adminConfirmManual = require('./admin-confirm-manual');
const activationStoreMemory = require('./activation-store-memory');

module.exports = {
  ...pricing,
  ...entitlements,
  ...promo,
  ...contractFactory,
  ...planMinimo,
  validateUpload: uploadGate.validateUpload,
  ...validateOrden,
  ...slotInventory,
  ...persistOrden,
  ...activationService,
  ...adminConfirmManual,
  createMemoryActivationStore: activationStoreMemory.createMemoryActivationStore,
};
