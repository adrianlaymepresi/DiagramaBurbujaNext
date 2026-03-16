"use client";

import { ClipboardEvent } from "react";

import { ClaveCampoFila, FilaBurbujaEditable } from "@/types/diagrama";
import { LIMITE_FILAS } from "@/utils/numeros";

interface PropiedadesEditorTablaBurbuja {
  filas: FilaBurbujaEditable[];
  celdasInvalidas: Set<string>;
  mensaje?: string;
  puedeAgregarFila: boolean;
  alCambiarValor: (filaId: string, campo: ClaveCampoFila, valor: string) => void;
  alAgregarFila: () => void;
  alEliminarFila: (filaId: string) => void;
  alGenerarDiagrama: () => void;
  alPegarDesdeExcel: (texto: string, indiceFila: number, indiceCampo: number) => string | undefined;
  alPegarDesdePortapapeles: () => Promise<void>;
}

const CAMPOS: { clave: ClaveCampoFila; etiqueta: string }[] = [
  { clave: "valorX", etiqueta: "Eje X" },
  { clave: "valorY", etiqueta: "Eje Y" },
  { clave: "valorTamano", etiqueta: "Tamaño de la burbuja" },
];

export function EditorTablaBurbuja({
  filas,
  celdasInvalidas,
  mensaje,
  puedeAgregarFila,
  alCambiarValor,
  alAgregarFila,
  alEliminarFila,
  alGenerarDiagrama,
  alPegarDesdeExcel,
  alPegarDesdePortapapeles,
}: PropiedadesEditorTablaBurbuja) {
  const esMensajeExito =
    typeof mensaje === "string" &&
    (mensaje.includes("correctamente") ||
      (mensaje.includes("Se pegaron") && !mensaje.includes("no son numéricas")));

  function manejarPegado(
    evento: ClipboardEvent<HTMLInputElement>,
    indiceFila: number,
    indiceCampo: number
  ): void {
    evento.preventDefault();
    const texto = evento.clipboardData.getData("text/plain");
    alPegarDesdeExcel(texto, indiceFila, indiceCampo);
  }

  return (
    <section className="tarjeta" aria-label="Editor de tabla de datos">
      <h2>1. Ingreso de datos</h2>
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>#</th>
              {CAMPOS.map((campo) => (
                <th key={campo.clave}>{campo.etiqueta}</th>
              ))}
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, indiceFila) => (
              <tr key={fila.id}>
                <td>{indiceFila + 1}</td>
                {CAMPOS.map((campo, indiceCampo) => {
                  const clave = `${fila.id}-${campo.clave}`;
                  const esInvalida = celdasInvalidas.has(clave);
                  return (
                    <td key={campo.clave}>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={`entrada-celda ${esInvalida ? "celda-invalida" : ""}`.trim()}
                        value={fila[campo.clave]}
                        aria-invalid={esInvalida}
                        onChange={(evento) =>
                          alCambiarValor(fila.id, campo.clave, evento.target.value)
                        }
                        onPaste={(evento) => manejarPegado(evento, indiceFila, indiceCampo)}
                        placeholder="Número"
                      />
                    </td>
                  );
                })}
                <td>
                  <button
                    type="button"
                    className="boton boton-secundario"
                    onClick={() => alEliminarFila(fila.id)}
                    disabled={filas.length <= 1}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="fila-botones">
        <button
          type="button"
          className="boton boton-secundario"
          onClick={alAgregarFila}
          disabled={!puedeAgregarFila}
        >
          Agregar fila
        </button>
        <button type="button" className="boton boton-primario" onClick={alGenerarDiagrama}>
          Generar diagrama
        </button>
        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => {
            void alPegarDesdePortapapeles();
          }}
        >
          Pegar desde portapapeles
        </button>
      </div>
      <p className="mensaje">Máximo {LIMITE_FILAS} filas. Mínimo 1 fila completa para generar.</p>
      {mensaje ? (
        <p className={`mensaje ${esMensajeExito ? "mensaje-exito" : "mensaje-error"}`}>
          {mensaje}
        </p>
      ) : null}
    </section>
  );
}