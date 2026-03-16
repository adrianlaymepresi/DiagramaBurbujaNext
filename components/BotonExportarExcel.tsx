"use client";

import { RefObject, useState } from "react";
import { toPng } from "html-to-image";

import { exportarDiagramaBurbujaAExcel } from "@/services/servicioExcel";
import { ConfiguracionNombresDiagrama, DatoBurbuja } from "@/types/diagrama";

interface PropiedadesBotonExportarExcel {
  datos: DatoBurbuja[];
  nombres: ConfiguracionNombresDiagrama;
  referenciaGrafico: RefObject<HTMLDivElement | null>;
  deshabilitado: boolean;
  alFinalizarExportacion: (mensaje: string, esError: boolean) => void;
}

export function BotonExportarExcel({
  datos,
  nombres,
  referenciaGrafico,
  deshabilitado,
  alFinalizarExportacion,
}: PropiedadesBotonExportarExcel) {
  const [exportando, setExportando] = useState(false);

  async function manejarExportacion(): Promise<void> {
    try {
      setExportando(true);

      let imagenBase64: string | undefined;
      if (referenciaGrafico.current) {
        imagenBase64 = await toPng(referenciaGrafico.current, {
          quality: 1,
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
      }

      await exportarDiagramaBurbujaAExcel({
        datos,
        nombres,
        imagenGraficoBase64: imagenBase64,
      });

      alFinalizarExportacion("Archivo Excel exportado correctamente.", false);
    } catch {
      alFinalizarExportacion(
        "No se pudo exportar el Excel. Verifica que el gráfico esté generado e intenta nuevamente.",
        true
      );
    } finally {
      setExportando(false);
    }
  }

  return (
    <button
      type="button"
      className="boton boton-primario"
      onClick={manejarExportacion}
      disabled={deshabilitado || exportando}
    >
      {exportando ? "Exportando..." : "Exportar a Excel"}
    </button>
  );
}