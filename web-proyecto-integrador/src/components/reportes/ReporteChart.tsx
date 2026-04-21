import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface Props {
  title: string;
  data: any[];
  dataKey: string;
  nameKey: string;
}

const COLORS = [
  "#0088FE", 
  "#00C49F", 
  "#FFBB28", 
  "#FF8042", 
  "#845EC2", 
  "#FF5EC2"
];

export default function ReporteChart({ title, data, dataKey, nameKey }: Props) {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<"stacked" | "activos" | "inactivos">("stacked");


  const pieData = (() => {
                    if (!data || data.length === 0) return [];

                    if (data[0]?.activos !== undefined) {
                      if (modo === "activos") {
                        return data.map(d => ({
                          name: d[nameKey],
                          value: d.activos
                        }));
                      }

                      if (modo === "inactivos") {
                        return data.map(d => ({
                          name: d[nameKey],
                          value: d.inactivos
                        }));
                      }

                      // ambos
                      return data.map(d => ({
                        name: d[nameKey],
                        value: d.activos + d.inactivos
                      }));
                    }

                    return data.map(d => ({
                      name: d[nameKey],
                      value: d[dataKey]
                    }));
                  })();

  return (
    <div className="reporte-chart-container">
      
      {/* TITULO */}
      <h2 
        className="reporte-title"
        onClick={() => setOpen(!open)}
      >
        {title} {open ? "▲" : "▼"}
      </h2>

      {open && (
        <>
          {/* 👇 BOTONES ARRIBA */}
          <div className="chart-controls">
            <button
              className={modo === "stacked" ? "active" : ""}
              onClick={() => setModo("stacked")}
            >
              Ambos
            </button>

            <button
              className={modo === "activos" ? "active" : ""}
              onClick={() => setModo("activos")}
            >
              Activos
            </button>

            <button
              className={modo === "inactivos" ? "active" : ""}
              onClick={() => setModo("inactivos")}
            >
              Inactivos
            </button>
          </div>

          {/* 👇 GRAFICOS */}
          <div className="charts-row">

            {/* 📊 BARRAS */}
            <div className="chart-bar-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey={nameKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {data[0]?.activos !== undefined ? (
                    <>
                      {modo === "stacked" && (
                        <>
                          <Bar dataKey="activos" stackId="a" fill="#16a34a" />
                          <Bar dataKey="inactivos" stackId="a" fill="#ef4444" />
                        </>
                      )}

                      {modo === "activos" && (
                        <Bar dataKey="activos" fill="#16a34a" />
                      )}

                      {modo === "inactivos" && (
                        <Bar dataKey="inactivos" fill="#ef4444" />
                      )}
                    </>
                  ) : (
                    <Bar dataKey={dataKey} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 🥧 TORTA */}
            <div className="chart-pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="70%"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>


                  <Legend verticalAlign="bottom" height={40} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}
    </div>
  );
}