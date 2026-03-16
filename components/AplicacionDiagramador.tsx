"use client";

import { useRef } from "react";

import { BotonExportarExcel } from "@/components/BotonExportarExcel";
import { EditorTablaBurbuja } from "@/components/EditorTablaBurbuja";
import { FormularioConfiguracionDiagrama } from "@/components/FormularioConfiguracionDiagrama";
import { GraficoBurbuja } from "@/components/GraficoBurbuja";
import { PanelConfiguracionEjes } from "@/components/PanelConfiguracionEjes";
import { PanelPersonalizacionBurbuja } from "@/components/PanelPersonalizacionBurbuja";
import { useEstadoDiagramaBurbuja } from "@/hooks/useEstadoDiagramaBurbuja";

export function AplicacionDiagramador() {
  const referenciaGrafico = useRef<HTMLDivElement>(null);

  const {
    filas,
    celdasInvalidas,
    mensaje,
    diagramaGenerado,
    nombresDiagrama,
    datosGraficos,
    indiceSeleccionado,
    configuracionEjes,
    puedeAgregarFila,
    hayDatosParaExportar,
    actualizarValorCelda,
    agregarFila,
    eliminarFila,
    aplicarPegadoDesdeExcel,
    generarDiagrama,
    cambiarNombreDiagrama,
    seleccionarBurbuja,
    cambiarColorBurbujaSeleccionada,
    cambiarConfiguracionEje,
    setMensaje,
  } = useEstadoDiagramaBurbuja();

  return (
    <main className="pagina">
      <div className="contenedor-principal">
        <header className="encabezado">
          <h1 className="titulo-principal">Diagramador de Burbujas</h1>
          <p className="descripcion-principal">
            Ingresa o pega tus datos desde Excel, genera el gráfico y personaliza colores, ejes y nombres.
          </p>
        </header>

        <div className="rejilla">
          <div className="columna">
            <EditorTablaBurbuja
              filas={filas}
              celdasInvalidas={celdasInvalidas}
              mensaje={mensaje}
              puedeAgregarFila={puedeAgregarFila}
              alCambiarValor={actualizarValorCelda}
              alAgregarFila={agregarFila}
              alEliminarFila={eliminarFila}
              alGenerarDiagrama={generarDiagrama}
              alPegarDesdeExcel={(texto, indiceFila, indiceCampo) => {
                const resultado = aplicarPegadoDesdeExcel(texto, indiceFila, indiceCampo);
                if (resultado.mensaje) {
                  setMensaje(resultado.mensaje);
                }
                return resultado.mensaje;
              }}
            />
            <div className="tarjeta">
              <h3>4. Exportación</h3>
              <p className="mensaje">Exporta la tabla y el gráfico en un archivo Excel presentable.</p>
              <div className="fila-botones">
                <BotonExportarExcel
                  datos={datosGraficos}
                  nombres={nombresDiagrama}
                  referenciaGrafico={referenciaGrafico}
                  deshabilitado={!hayDatosParaExportar}
                  alFinalizarExportacion={(mensajeExportacion, esError) => {
                    setMensaje(mensajeExportacion);
                    if (esError) {
                      return;
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="columna">
            {diagramaGenerado ? (
              <>
                <GraficoBurbuja
                  referenciaGrafico={referenciaGrafico}
                  datos={datosGraficos}
                  nombres={nombresDiagrama}
                  configuracionEjes={configuracionEjes}
                  indiceSeleccionado={indiceSeleccionado}
                  alSeleccionarBurbuja={seleccionarBurbuja}
                />
                <FormularioConfiguracionDiagrama
                  nombres={nombresDiagrama}
                  alCambiarNombre={cambiarNombreDiagrama}
                />
                <PanelPersonalizacionBurbuja
                  datos={datosGraficos}
                  indiceSeleccionado={indiceSeleccionado}
                  alCambiarColor={cambiarColorBurbujaSeleccionada}
                />
                <PanelConfiguracionEjes
                  configuracionEjes={configuracionEjes}
                  alCambiarEje={cambiarConfiguracionEje}
                />
              </>
            ) : (
              <section className="tarjeta">
                <h2>2. Diagrama de burbujas</h2>
                <p className="mensaje">
                  Genera el diagrama para habilitar la personalización de ejes, nombres y colores por burbuja.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}