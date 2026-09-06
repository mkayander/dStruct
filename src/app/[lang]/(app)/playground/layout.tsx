import { PlaygroundLayoutClient } from "#/features/playground/ui/PlaygroundLayoutClient";

export default function LangPlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlaygroundLayoutClient>{children}</PlaygroundLayoutClient>;
}
