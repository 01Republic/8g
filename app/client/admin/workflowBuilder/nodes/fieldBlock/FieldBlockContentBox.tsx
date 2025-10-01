import type { ReactNode } from "react";

interface FieldBlockContentBoxProps {
  children: ReactNode;
}

export const FieldBlockContentBox = (props: FieldBlockContentBoxProps) => {
  const { children } = props;
  return <section className="flex flex-col gap-2">{children}</section>;
};
