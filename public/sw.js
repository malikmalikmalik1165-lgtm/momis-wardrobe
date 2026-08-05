self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", (e) => {
  let data = { title: "Momis Wardrobe", body: "Naya update!", icon: "/icons/icon-192.png", url: "/" };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png",
      vibrate: [200, 100, 200], data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.openWindow(e.notification.data?.url || "/"));
});
