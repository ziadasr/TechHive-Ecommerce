/**
 * in axios it fails in apireq.delete to send body so we have to use post or send the id as query or use post or anyother method
 * so i choosed to use post for now
 */

/**
 * notice the difference between the promise and obj
 * the obj is a ready value while the promise is a future value
 * so when we call a function that return a promise we have to wait for it to resolve
 * so we use then or await
 * the promise is such a placeholder that waits for the value to be ready
 */

/**
 * The Context Provider (like ProductProvider) is a central place that holds the products data in its state.
 *  When the app starts, the provider fetches products from your backend using fetchProducts.
 * The products data is stored in the provider’s state and made available to all child components via Context.
 * Any component that consumes the context (using ProductConsumer or useContext) gets access to the same products data.
 * If the products data changes (e.g., a product is added to the cart), the provider updates its state, and all consumers automatically see the updated data.
 */

/**
 * catch error as any
 * ts by default doesnt know ab the erro it js catch anyhting so we have to tell it
 * it could catch a message or obj string or anything
 * then we can check if its axios error by checking if error.response exist
 * if yes we can throw the error as our ErrorResponse type
 * if not we throw a network error
 */

/**
 * instead of prop passing from one component to another so we get context which allows all components to have a general dtat
 * this link explain the idea
 * https://youtu.be/n7xQVRpYHYY?si=E3AdRG0gRCyE1TjJ
 */

//!backendd===========================================================================================================
/**
 * ! the error was that sequelize runs but never creates the table thats because product.ts is never excuted
 * * so i had to call anything that force excutes the model
 * * console.log("Product class loaded:", Product.name);
 */

/**
 * req (err as any)
 * here u are telling ts that err can be anything
 * it would be catch for any throw
 * maybe it is a string or obj or anything
 * then we check that this error has an error code and message
 */

/**
* !double booking problem

Imagine your store has 1 item left of a “MacBook Pro.”
Two customers (A and B) both click “Buy Now” at almost the same time.
Both see “In Stock: 1.”
Both send checkout requests.
If not handled carefully, both orders may succeed, and your stock becomes -1, which causes refund, confusion, or angry customers.
This is the double booking (or overselling) problem. 
*=====================================================================================

////1. Final Check Before Confirming Purchase not a valid solution 
*=====================================================================================

**Atomic Stock Update (Safe Write Operation)
When user confirms, the system tries to decrease stock by 1 only if current stock > 0.
The “check and reduce” happens together — no gap between them.
Only one user can succeed.
The second user’s update fails because stock is already 0.
*=====================================================================================
**Locking System (Pessimistic Lock)
When user starts checkout → mark the product as “locked.”
During that time, other users can see it but not buy it.
If payment succeeds → reduce stock and unlock.
If payment fails or times out → unlock after a few minutes.

*!if we go for this option we would face deadlocks in the following scenario
If two users each try to lock two different rows in opposite order,
they can end up waiting for each other forever.
To prevent this, always lock in a consistent order (for example, by product ID).
============================================================================================================================================================================
| Lock Type                           | What it does                                      | Who is blocked                                                                 |
| ----------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Shared Lock (READ)**              | Allows reading, but not modifying                 | Other transactions can *also* read, but not modify                             |
| **Exclusive Lock (WRITE / UPDATE)** | Allows both reading & writing for the locker only | Other transactions can neither *modify* nor *lock* the same row until released |
============================================================================================================================================================================
============================================================================================================================================================================
| Concept              | Meaning                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| **Pessimistic lock** | Prevents others from modifying until you finish                                                      |
| **Exclusive lock**   | Strongest lock — only one writer allowed                                                             |
| **Isolation level**  | Defines what others *see* while your transaction runs                                                |
| **Result**           | Others can *read* but not *write* (unless you use the strictest isolation level like `serializable`) |
============================================================================================================================================================================


}
*======================================================================================
**Queueing System (First Come, First Served)
All checkout requests go into a queue and are processed one by one.
Pros:
Perfect fairness.
Eliminates race conditions entirely.

Cons:
Adds slight delay since requests wait in line.
More useful for high-demand events (concert tickets, flash sales).
*/

/**
 * !isolation levels in transactions
===================================================================================================
| Isolation Level  | Sees Latest Committed Data? | Sees Uncommitted? | Snapshot Stays Frozen?     |
| ---------------- | --------------------------- | ----------------- | ----------------------     |
| READ UNCOMMITTED | ✅ (even uncommitted)        | ✅                 | ❌                      |
| READ COMMITTED   | ✅ (latest committed only)   | ❌                 | ❌                      |
| REPEATABLE READ  | ❌ (stays on snapshot)       | ❌                 | ✅                      |
| SERIALIZABLE     | ✅ (strict order enforced)   | ❌                 | ✅ (with validation)    |
===================================================================================================

 */

/**
 * *transactions in sequelize
 * * in transaction you choose the isolation level u need and add extra rules useing locks
 * * t.commit is ==> everything is okay now save elsa is the rollback t.transactoin() opens a connetion that waits for any command
 * *sequelize 4 levels of isolation in databasses1
 * * 1. READ UNCOMMITTED (weakest)
 * ! the issue is that other commands could see a rollbacked data
 * * 2. READ COMMITTED (default in PostgreSQL, SQL Server)
 * ! if two or more transactions are running on the same table maybe one finishes before others so same query could see different data
 * * REPEATABLE READ (default in MySQL InnoDB)
 * * Once a transaction reads a row, it will always see the same value for that row during the transaction, even if another transaction commits changes.
 * ! If you run a query that matches multiple rows, another transaction can still insert new rows that match the condition and got missed
 * * SERIALIZABLE (strongest)
 * * Transactions behave as if they are executed one after the other, no overlaps.
 * ! Database may use locking or aborting transactions to enforce this.
 * * which means rollback atransaction or block it till the other on finishes
 */

/**
 * * Shared Lock ==> others can read but blocks delete and update and if there is any write have to stay untill all transactions stop hold
 * * Exclusive Lock ==> if one transaction is writing no other transactions can read or write
 * * table shared ==> multiple transactions can read the whole table, but no one can write.
 * * exclusive shared ==> one transaction “owns” the table, no one else can read or write until it’s done.
 * * Range Lock ==> (Gap Lock) this prevents from inserting more rows inside the table while its hold by other transaction
 * * Next-Key Lock ==> it locks the row itself from editing and the gaps between rows
 */

/**
 * deadlock with double booking problem
 * if we go for the hardlock row solution we would face deadlocks in the following scenario
 * If two users each try to lock two different rows in opposite order,
 * they can end up waiting for each other forever.
 * here the db handle it and drop on ethe transactions the simple way is to retry 3 times for example
 */
