const { Schema, model } = require('mongoose')

const schema = new Schema({
  Amount: { type: Number },
  ApprovedAmount: { type: Number },
  ApprovalCode: { type: String },
  CardNumber: { type: String },
  ClientName: { type: String },
  ClientEmail: { type: String },
  Currency: { type: String },
  DateTime: { type: String },
  DepositedAmount: { type: Number },
  Description: { type: String },
  MerchantId: { type: String },
  Opaque: { type: Number },
  OrderID: { type: String },
  PaymentState: { type: String },
  PaymentType: { type: String },
  ResponseCode: { type: String },
  rrn: { type: String },
  TerminalId: { type: String },
  TrxnDescription: { type: String },
  OrderStatus: { type: Number },
  RefundedAmount: { type: Number },
  CardHolderID: { type: String },
  MDOrderID: { type: String },
  PrimaryRC: { type: String },
  ExpDate: { type: String },
  ProcessingIP: { type: String },
  BindingID: { type: String },
  ActionCode: { type: String },
  ExchangeRate: { type: Number },
  date: { type: Date, default: Date.now }
})

module.exports = model('PaymentDetailsResponse', schema)
