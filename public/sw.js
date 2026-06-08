self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let payload = { title: "Helios", body: "Nouvelle notification", url: "/client" };

  try {
    payload = { ...payload, ...event.data.json() };
  } catch {
    payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/favicon.ico",
      data: { url: payload.url ?? "/client" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/client";
  event.waitUntil(clients.openWindow(url));
});
