"use client";

import { DatoBurbuja } from "@/types/diagrama";

interface PropiedadesPanelPersonalizacionBurbuja {
  datos: DatoBurbuja[];
  indiceSeleccionado: number | null;
  alCambiarColor: (color: string) => void;
}

export function PanelPersonalizacionBurbuja({
  datos,
  indiceSeleccionado,
  alCambiarColor,
}: PropiedadesPanelPersonalizacionBurbuja) {
  const datoSeleccionado =
    indiceSeleccionado !== null && indiceSeleccionado >= 0 ? datos[indiceSeleccionado] : undefined;

  return (
    <section className="tarjeta" aria-label="Personalización de burbuja">
      <h3>Personalización de burbuja</h3>
      {datoSeleccionado ? (
        <>
          <p className="mensaje">
            Burbuja {indiceSeleccionado! + 1} · X: {datoSeleccionado.x} · Y: {datoSeleccionado.y} · Tamaño: {datoSeleccionado.z}
          </p>
          <div className="campo">
            <label htmlFor="color-burbuja" className="etiqueta-color">
              <span>Color individual</span>
              <span className="punto-color" style={{ backgroundColor: datoSeleccionado.color }} />
            </label>
            <input
              id="color-burbuja"
              type="color"
              className="selector-color"
              value={datoSeleccionado.color}
              onChange={(evento) => alCambiarColor(evento.target.value)}
            />
          </div>
        </>
      ) : (
        <p className="mensaje">Selecciona una burbuja en el gráfico para cambiar su color.</p>
      )}
    </section>
  );
}