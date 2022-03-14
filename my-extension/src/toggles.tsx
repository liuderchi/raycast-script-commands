import fs from "node:fs";
import { ActionPanel, List, Action, Toast, showToast, environment } from "@raycast/api";
import { useState, useEffect, useCallback, FC } from "react";
import { runAppleScript } from "run-applescript";

import DebugListItem from "./Debug";

const checkFileExists = (file: string): Promise<boolean> => {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const findUtilPath = async (): Promise<string> => {
  const possiblePaths = ["/usr/local/bin/blueutil", "/opt/homebrew/bin/blueutil"];
  const isExist = await checkFileExists(possiblePaths[0]);
  return isExist ? possiblePaths[0] : possiblePaths[1];
};

type GetStatusResult = "1" | "0";

// Note require cli blueutil (brew install blueutil)
const getStatus = (utilPath: string) => `
  set btStatus to do shell script "${utilPath} -p"
  return btStatus
`;

const toggleStatus = (utilPath: string) => `
  do shell script "${utilPath} -p toggle"
`;

// if command mode is "view", exported function should NOT be async
const MenuList: FC = () => {
  const [isBtOn, setIsBtOn] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const toggleBluetooth = useCallback(async (current?: boolean) => {
    try {
      setLoading(true);
      showToast({ style: Toast.Style.Animated, title: "Toggling" });
      const utilPath = await findUtilPath();
      await runAppleScript(toggleStatus(utilPath));
      showToast(Toast.Style.Success, `Bluetooth is ${!current ? "on" : "off"}`);
    } catch (error) {
      showToast(Toast.Style.Failure, String(error));
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusCallback = useCallback(async () => {
    try {
      setLoading(true);
      const utilPath = await findUtilPath();
      const result = (await runAppleScript(getStatus(utilPath))) as GetStatusResult;
      if (result === "1") {
        setIsBtOn(true);
      } else if (result === "0") {
        setIsBtOn(false);
      }
    } catch (error) {
      showToast(Toast.Style.Failure, String(error));
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getStatusCallback();
  }, []);

  return (
    <List isLoading={loading}>
      <List.Item
        icon="bluetooth.png"
        title={`Bluetooth: ${loading || typeof isBtOn !== "boolean" ? "..." : isBtOn ? `🟢` : `🚫`}`}
        actions={
          !loading && (
            <ActionPanel>
              <Action
                title={isBtOn ? "Turn Off" : "Turn On"}
                onAction={() => {
                  toggleBluetooth(isBtOn).then(() => {
                    getStatusCallback();
                  });
                }}
              />
            </ActionPanel>
          )
        }
      />
      {environment.isDevelopment && <DebugListItem />}
    </List>
  );
};

export default MenuList;
