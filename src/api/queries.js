// Confirm transaction filter and field names against the authenticated schema in GraphiQL.
// These fields match the schema shape used by the project's existing API client.
export const CURRENT_USER_QUERY = `
  query CurrentUser {
    user {
      id
      login
      attrs
    }
  }
`;

// XP follows the requested event and child-event scope. Other profile metrics
// are fetched separately and remain scoped to this user across all history.
export const STUDENT_XP_QUERY = `
  query StudentXP($userId: Int!, $limit: Int!, $eventId: Int!) {
    transaction(
      where: {
        userId: { _eq: $userId }
        type: { _eq: "xp" }
        _or: [
          { eventId: { _eq: $eventId } }
          { _and: [
            { event: { parentId: { _eq: $eventId } } }
            { event: { object: { type: { _nin: ["module", "piscine"] } } } }
          ] }
        ]
      }
      order_by: { createdAt: desc }
      limit: $limit
    ) {
      id
      attrs
      type
      amount
      eventId
      path
      objectId
      createdAt
      object { name type }
    }
  }
`;

export const STUDENT_METRICS_QUERY = `
  query StudentTransactions($userId: Int!, $limit: Int!, $offset: Int!) {
    transaction(
      where: {
        userId: { _eq: $userId }
        _or: [
          { type: { _in: ["level", "up", "down"] } }
          { type: { _like: "skill_%" } }
        ]
      }
      order_by: { id: asc }
      limit: $limit
      offset: $offset
    ) {
      id
      type
      amount
    }
  }
`;
