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

  async function pegarDesdePortapapeles(): Promise<void> {
    try {
      if (!navigator.clipboard?.readText) {
        setMensaje("Tu navegador no permite leer el portapapeles de forma directa.");
        return;
      }

      const textoPortapapeles = await navigator.clipboard.readText();
      if (!textoPortapapeles.trim()) {
        setMensaje("El portapapeles está vacío o no contiene datos de tabla.");
        return;
      }

      const resultado = aplicarPegadoDesdeExcel(textoPortapapeles, 0, 0);
      if (resultado.mensaje) {
        setMensaje(resultado.mensaje);
      }
    } catch {
      setMensaje(
        "No se pudo leer el portapapeles. Usa Ctrl+V sobre una celda o concede permisos al navegador."
      );
    }
  }

  return (
    <main className="pagina">
      <div className="contenedor-principal">
        <header className="encabezado">
          <h1 className="titulo-principal">Diagramador de Burbujas</h1>
          <p className="descripcion-principal">
            Ingresa o pega tus datos desde Excel, genera el gráfico y personaliza colores, ejes y nombres.
          </p>
        </header>

        <div className="flujo-vertical">
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
            alPegarDesdePortapapeles={pegarDesdePortapapeles}
          />

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
      </div>
    </main>
  );
}