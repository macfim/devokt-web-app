import { useState } from "react";

import { IAlert, EAlertStatus } from "../utils/interfaces";

type TNotifie = (arg0: EAlertStatus, arg1: string) => void;

const TIMEOUT = 3000;

export const useAlert = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const notifie: TNotifie = (status, content) => {
    const id = new Date().getTime();

    setAlerts((prev) => [
      ...prev,
      {
        id,
        content,
        status,
        timeout: setTimeout(() => {
          removeAlert(id);
        }, TIMEOUT),
      },
    ]);
  };

  return { alerts, removeAlert, notifie };
};
