import { CURRENT_USER_QUERY, STUDENT_METRICS_QUERY, STUDENT_XP_QUERY } from "./queries.js";

export const GRAPHQL_URL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

async function request(query, variables, token) {
  let response;
  try {
    response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    throw new Error("Could not reach the profile service. Check your connection and try again.");
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`The profile service returned an unreadable response (${response.status}).`);
  }
  if (response.status === 401 || response.status === 403) {
    const error = new Error("Your session has expired. Please sign in again.");
    error.sessionExpired = true;
    throw error;
  }
  if (!response.ok || body.errors?.length) {
    const message = body.errors?.map(({ message }) => message).join("; ") || `Request failed (${response.status}).`;
    const error = new Error(message);
    if (/jwt|unauthorized|not authorized/i.test(message)) {
      error.sessionExpired = true;
      error.message = "Your session is no longer valid. Please sign in again.";
    }
    throw error;
  }
  return body.data;
}

export async function fetchProfile(token) {
  const userData = await request(CURRENT_USER_QUERY, {}, token);
  const user = Array.isArray(userData.user) ? userData.user[0] : userData.user;
  if (!user?.id) {
    const error = new Error("No user was returned for this session. Please sign in again.");
    error.sessionExpired = true;
    throw error;
  }

  const userId = Number(user.id);
  const [xpData, metricsData] = await Promise.all([
    request(STUDENT_XP_QUERY, { userId, eventId: 763, limit: 1000 }, token),
    (async () => {
      const pageSize = 500;
      const rows = [];
      for (let offset = 0; ; offset += pageSize) {
        const data = await request(STUDENT_METRICS_QUERY, { userId, limit: pageSize, offset }, token);
        const page = data.transaction || [];
        rows.push(...page);
        if (page.length < pageSize) return rows;
      }
    })(),
  ]);
  const transactions = [
    ...(xpData.transaction || []),
    ...metricsData,
  ];
  return { user, transactions };
}
