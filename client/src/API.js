const API_URL = "http://localhost:1337/api/logs";

export const listLogEntries = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createLogEntry = async (entry) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return res.json();
};
