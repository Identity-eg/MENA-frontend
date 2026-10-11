# MENA Business Data — Customer App

The customer-facing app of the MENA company-registry marketplace. The canonical glossary lives in `../backend/CONTEXT.md`; this file records only how those terms surface to customers.

## Language

### Ordering

**Request**:
A customer's order for one or more Request lines, billed together by one Invoice. Shown to customers as "Request" with a `REQ-000123` reference.
_Avoid_: Order, screening, screening package

**Request line**:
One Report ordered for one company within a Request. Customers see it as "a report on <company>".
_Avoid_: Request report, subject, line item

**Delivery**:
The file that fulfils one Request line. Customers download it once the line is delivered.
_Avoid_: Upload, report file

**Refund due**:
A Request line rejected after its Request was paid, so its price is owed back to the customer. The refund itself is issued outside the app.
_Avoid_: Refunded

**Next step**:
The single thing a customer must do — or is waiting on — for a Request to move forward (pay the Invoice, wait for review, download Deliveries).
_Avoid_: Action item, task

### Credits

**Credit balance**:
The Credits a customer can spend right now. Always visible as a chip in the top bar (on phones the number alone, next to the coin), linking to the Credits page, which also lists the Credit history and Plan purchases. Shown as "1,000 credits"; it changes only when the server confirms a Grant, Spend, Refund or Adjustment.
_Avoid_: Wallet, points, account balance

**Credit plan**:
A one-time pack of Credits for a price, offered on the Pricing page ("300 credits for $29"). Buying one opens a Stripe checkout; the Credits arrive once the payment is confirmed, which the checkout return page waits for. Customers can buy any plan as often as they like.
_Avoid_: Subscription, membership, package, tier

**Unlock**:
Revealing one Sensitive field of a company for good, for its Field cost in Credits, after the customer confirms the cost and the balance left. "Unlock all" reveals every remaining field of the company in one confirmation. Unlocked fields stay visible on the company page and are listed under "My unlocks" with the Credits spent. When the balance is short, the customer is offered Credit plans instead.
_Avoid_: Purchase, buy, pay to view
