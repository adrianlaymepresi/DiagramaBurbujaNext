"use client";

import { RefObject } from "react";
import {
  CartesianGrid,
  Cell,
  Label,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { ConfiguracionEjes, ConfiguracionNombresDiagrama, DatoBurbuja } from "@/types/diagrama";
import { construirTicks } from "@/utils/ejes";

interface PropiedadesGraficoBurbuja {
  referenciaGrafico: RefObject<HTMLDivElement | null>;
  datos: DatoBurbuja[];
  nombres: ConfiguracionNombresDiagrama;
  configuracionEjes: ConfiguracionEjes;
  indiceSeleccionado: number | null;
  alSeleccionarBurbuja: (indice: number) => void;
}

export function GraficoBurbuja({
  referenciaGrafico,
  datos,
  nombres,
  configuracionEjes,
  indiceSeleccionado,
  alSeleccionarBurbuja,
}: PropiedadesGraficoBurbuja) {
  const ticksX = construirTicks(configuracionEjes.ejeX);
  const ticksY = construirTicks(configuracionEjes.ejeY);

  return (
    <section className="tarjeta" aria-label="Visualización del diagrama">
      <h2>2. Diagrama de burbujas</h2>
      <div className="contenedor-grafico" ref={referenciaGrafico}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d7e3d9" />
            <XAxis
              type="number"
              dataKey="x"
              name={nombres.ejeX}
              ticks={ticksX}
              domain={[configuracionEjes.ejeX.inicio, configuracionEjes.ejeX.maximo]}
            >
              <Label value={nombres.ejeX} offset={-6} position="insideBottom" fill="#2d4e3e" />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name={nombres.ejeY}
              ticks={ticksY}
              domain={[configuracionEjes.ejeY.inicio, configuracionEjes.ejeY.maximo]}
            >
              <Label
                value={nombres.ejeY}
                angle={-90}
                position="insideLeft"
                fill="#2d4e3e"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <ZAxis type="number" dataKey="z" range={[90, 1800]} name={nombres.variableTamano} />
            <Tooltip
              cursor={{ strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: "10px",
                borderColor: "#c8d8cc",
                backgroundColor: "#ffffff",
              }}
            />
            <Scatter
              name={nombres.variableTamano}
              data={datos}
              onClick={(_, indice) => {
                if (typeof indice === "number") {
                  alSeleccionarBurbuja(indice);
                }
              }}
            >
              {datos.map((dato, indice) => (
                <Cell
                  key={dato.id}
                  fill={dato.color}
                  stroke={indiceSeleccionado === indice ? "#0e2f20" : "#ffffff"}
                  strokeWidth={indiceSeleccionado === indice ? 3 : 1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="leyenda-seleccion">
        {indiceSeleccionado !== null
          ? `Burbuja seleccionada: ${indiceSeleccionado + 1}`
          : "Selecciona una burbuja para personalizar su color."}
      </p>
    </section>
  );
}