import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Card({ children }: Props) {
  return <div style={styles.card}>{children}</div>;
}

const styles = {
  card: {
    background: "white",
    padding: "0px",
    borderRadius: "10px",
    width: "100%",
    
  },
};