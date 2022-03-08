import { FC } from "react";
import { ActionPanel, List, Action, Detail, environment } from "@raycast/api";

const DebugListItem: FC<{ data?: Record<string, unknown> }> = ({ data = {} }) => {
  const markdown = `\`\`\`json
${JSON.stringify({ ...environment, ...data }, null, 2)}
\`\`\``;

  return (
    <List.Item
      icon="🐞"
      title="Debug Info"
      actions={
        <ActionPanel>
          <Action.Push title="Show Details" target={<Detail markdown={markdown} />} />
        </ActionPanel>
      }
    />
  );
};

export default DebugListItem;
