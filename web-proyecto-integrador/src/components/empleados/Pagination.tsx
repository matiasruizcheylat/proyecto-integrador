// components/empleados/Pagination.tsx

import "../../styles/Paginacion.css";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {

  const getPages = () => {
    const pages = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="paginacion">
      
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="btn-pag"
      >
        {"<<"}
      </button>

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-pag"
      >
        {"<"}
      </button>

      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`btn-pag ${p === page ? "active" : ""}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn-pag"
      >
        {">"}
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="btn-pag"
      >
        {">>"}
      </button>

    </div>
  );

}

// 🎨 estilos
const buttonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "white",
  cursor: "pointer",
};

const activeStyle: React.CSSProperties = {
  background: "#333",
  color: "white",
  fontWeight: "bold",
};