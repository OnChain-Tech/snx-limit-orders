# SNX Limit Orders (Work In Progress)

## Summary
We propose a trustless architecture for adding limit orders functionality to the Synthetix Exchange that would not require any changes to the core contracts.

## Abstract
To keep the integrity of the core Synthetix contracts in place, we propose the creation of a separate layer of “advanced mode” trading contracts to enable additional functionality. The primary contract is a limit order contract. The exchange users can place limit orders on it and send the order source amount to it. Additionally, they specify the parameters of limit orders, including destination asset price, allowed slippage and execution fees.

## Motivation
To increase the flexibility of the Synthetix exchange, limit order functionality is needed so users can effectively trade synthetic assets.
While limit orders can be trivial to implement in the case of centralized exchanges, in the case of a DEX such as Synthetix, limit orders can be challenging in terms of security guarantees and trustlessness due to client unavailability.

## Specification

* [SynthLimitOrder Solidity Contracts](specs/Contracts.md)
* [Limit Order Execution Node](specs/Node.md)
* [Client-side Javascript Library](specs/Library.md)


## Rationale
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->
### Limit Order Execution Nodes
By allowing anyone to run “limit order execution nodes” and compete for limit order execution fees, we achieve order execution reliability and censorship-resistance through permissionless-ness. These are especially important in the context of limit orders, where censorship or execution delays might cause trading losses.

### Upgradability
We use an upgradable proxy pattern in order to allow a present owner address to upgrade the core implementation contract at any time. That said, the upgrades are restricted by a timelock duration after an upgrade is initiated by the owner. In this duration, all order submitters are able to cancel any active orders if they wish to opt-out of the new implementation. This restriction enables traders to act in the unlikely scenario where the owner turns malicious or becomes compromised and attempts to create an upgrade that puts their funds at risk.