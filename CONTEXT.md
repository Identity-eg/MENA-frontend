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
