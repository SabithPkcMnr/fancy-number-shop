"use client";

import { useEffect, useState } from "react";
import { useAdminData } from "@/components/admin/admin-data";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalClient) => void | Promise<void>>;
  }
}

type OneSignalClient = {
  init: (options: Record<string, unknown>) => Promise<void>;
  User: { addTag: (key: string, value: string) => Promise<void> };
  Notifications: {
    permissionNative?: string;
    requestPermission: () => Promise<boolean>;
  };
};

let scriptAdded = false;
let startedAppId = "";

export function AdminPush() {
  const { data } = useAdminData();
  const appId = data?.settings.onesignalAppId ?? "";
  const [status, setStatus] = useState("Off");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!appId) return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    if (!scriptAdded) {
      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.defer = true;
      document.head.appendChild(script);
      scriptAdded = true;
    }
    window.OneSignalDeferred.push(async (OneSignal) => {
      if (startedAppId !== appId) {
        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerPath: "OneSignalSDKWorker.js",
          serviceWorkerParam: { scope: "/" },
        });
        startedAppId = appId;
      }
      await OneSignal.User.addTag("role", "admin");
      setReady(true);
      setStatus(OneSignal.Notifications.permissionNative === "granted" ? "On" : "Allow");
    });
  }, [appId]);

  if (!appId) return null;

  return (
    <button
      type="button"
      className="text-xs font-semibold rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/15"
      onClick={async () => {
        const deferred = window.OneSignalDeferred;
        if (!deferred) return;
        deferred.push(async (OneSignal) => {
          await OneSignal.Notifications.requestPermission();
          await OneSignal.User.addTag("role", "admin");
          setStatus(OneSignal.Notifications.permissionNative === "granted" ? "On" : "Allow");
        });
      }}
    >
      {ready ? `Alerts ${status}` : "Alerts…"}
    </button>
  );
}
