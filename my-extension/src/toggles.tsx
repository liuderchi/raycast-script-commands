import { ActionPanel, List, Action, Toast, showToast } from "@raycast/api";
import { useState, useEffect, useCallback, FC } from "react";
import { runAppleScript } from "run-applescript";

type GetStatusResult = "1" | "0";

// Note require cli blueutil (brew install blueutil)
const getStatus = `
  set btStatus to do shell script "/usr/local/bin/blueutil -p"
  return btStatus
`;

const toggleStatus = `
  do shell script "/usr/local/bin/blueutil -p toggle"
`;

// if command mode is "view", exported function should NOT be async
const MenuList: FC = () => {
  const [isBtOn, setIsBtOn] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const toggleBluetooth = useCallback(async (current?: boolean) => {
    try {
      setLoading(true);
      showToast({ style: Toast.Style.Animated, title: "Toggling" });
      await runAppleScript(toggleStatus);
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
      const result = (await runAppleScript(getStatus)) as GetStatusResult;
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
    </List>
  );
};

export default MenuList;
