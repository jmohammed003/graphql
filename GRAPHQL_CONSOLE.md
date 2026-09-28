# Verify the profile queries in Hasura / GraphiQL

Open the authenticated GraphiQL console and set `Authorization: Bearer <your JWT>` in request headers. Use event ID `763` and your user ID to run the XP query:

```graphql
query ($userId: Int!, $limit: Int!, $eventId: Int!) {
  transaction(where: {
    userId: { _eq: $userId },
    type: { _eq: "xp" },
    _or: [
      { eventId: { _eq: $eventId } }
      { _and: [
        { event: { parentId: { _eq: $eventId } } }
        { event: { object: { type: { _nin: ["module", "piscine"] } } } }
      ] }
    ]
  }, order_by: { createdAt: desc }, limit: $limit) {
    id
    attrs
    amount
    eventId
    path
    objectId
    createdAt
    object { name type }
  }
}
```

```json
{ "userId": 123, "eventId": 763, "limit": 1000 }
```

Replace `123` with your user ID. The app sums the returned XP transactions directly; the card's transaction count is the number of rows returned by this event-scoped query. Level, audit, and skill queries remain user-scoped and span all account history.
