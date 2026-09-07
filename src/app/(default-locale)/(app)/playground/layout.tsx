import { PlaygroundLayoutClient } from "#/features/playground/ui/PlaygroundLayoutClient";

export default function DefaultLocalePlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlaygroundLayoutClient>{children}</PlaygroundLayoutClient>;
}
