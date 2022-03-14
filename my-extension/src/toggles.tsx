import fs from "node:fs";
import { ActionPanel, List, Action, Toast, showToast, environment } from "@raycast/api";
import { useState, useEffect, useCallback, FC } from "react";
import { runAppleScript } from "run-applescript";

import DebugListItem from "./Debug";

let UTIL_PATH: string | undefined;

const findUtil = async (): Promise<string> => {
  // possible installation paths in different envs
  const UTIL_SEARCH_PATHS = ["/usr/local/bin/blueutil", "/opt/homebrew/bin/blueutil"];

  const checkFileExists = (file: string): Promise<boolean> => {
    return fs.promises
      .access(file, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  };

  if (!UTIL_PATH) {
    const checkResults = await Promise.all(
      UTIL_SEARCH_PATHS.map((path) => checkFileExists(path))
    );
    const result = UTIL_SEARCH_PATHS.find((p, idx) => checkResults[idx]) as string;
    UTIL_PATH = result;
  }

  return UTIL_PATH;
};

type GetStatusResult = "1" | "0";

// Note require cli blueutil (brew install blueutil)
const getStatus = () => `
  set btStatus to do shell script "${UTIL_PATH} -p"
  return btStatus
`;

const toggleStatus = () => `
  do shell script "${UTIL_PATH} -p toggle"
`;

// if command mode is "view", exported function should NOT be async
const MenuList: FC = () => {
  const [isBtOn, setIsBtOn] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  const toggleBluetooth = useCallback(async (current?: boolean) => {
    try {
      setLoading(true);
      showToast({ style: Toast.Style.Animated, title: "Toggling" });
      await findUtil();
      await runAppleScript(toggleStatus());
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
      await findUtil();
      const result = (await runAppleScript(getStatus())) as GetStatusResult;
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
        title={`Bluetooth: ${
          loading || typeof isBtOn !== "boolean" ? "..." : isBtOn ? `🟢` : `🚫`
        }`}
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
