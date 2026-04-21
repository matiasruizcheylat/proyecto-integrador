import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="container">
      <div className="card">{children}</div>
    </div>
  );
}