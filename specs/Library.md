# Client-side Javascript Library Spec

## Introduction

This library is proposed in order to provide a simple Javascript interface to the limit order functionality of the `SynthLimitOrder` contract.

## Requirements
The library must allow a simple interface to the following operations:
- Submit a new limit order
- Query the execution status of an active order
- Cancel an active order
- List all active orders submitted by the user's address

## API

### Constructor

``` js
const instance = new SynthLimitOrder(ethereumProvider)
```
The library must expose a `SynthLimitOrder` class. The user must instantiates a class instance by passing a valid ethereum provider with signing capabilities (e.g. Metamask) to the constructor.

### submitOrder

``` js
const orderID = await instance.submitOrder({
    sourceCurrencyKey,           // bytes32 string
    sourceAmount,                // base unit string amount
    destinationCurrencyKey,      // bytes32 string
    minDestinationAmount,        // base unit string amount
    weiDeposit,                  // wei string amount
    executionFee                 // wei string amount
})
```
This method allows the user to submit a new limit order on the contract by calling the `newOrder` contract function.

This method also automatically attempts to sign an ERC20 approve transaction for the `sourceCurrencyKey` token if a sufficient allowance is not already present for the contract.

It returns a `Promise<string>` as soon as the transaction is confirmed where the string contains the new order ID.

### cancelOrder

``` js
await instance.cancelOrder(orderID)
```
This method cancels an active order by calling the `cancelOrder` contract function.

It returns a `Promise<void>` as soon as the transaction is confirmed.

### getOrder

``` js
const order = await instance.getOrder(orderID)
```
This method allows the user to query the contract for a specific order number by querying the `orders` contract mapping.

It returns a promise that resolves with an `Order` object:
```ts
interface Order {
    submitter: string;
    orderID: string,
    sourceCurrencyKey: string;
    sourceAmount: string;
    destinationCurrencyKey: string;
    minDestinationAmount: string;
    weiDeposit:string;
    executionFee:string;
}
```

### getAllOrders

``` js
const order = await instance.getAllOrders()
```
This method allows the user to query the contract for an array all active orders submitted by the user's address. This array is constructed by querying a list of all past `Order` contract events filtered by the user's wallet address as the `submitter`. Each `orderID` is passed to the `getOrder` javascript method before being included in the returned array in order to ensure that the order is still active.

It returns a `Promise<Order[]>` where an `Order` follows the interface above.