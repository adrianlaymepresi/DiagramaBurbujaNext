"use client";

import { useMemo, useState } from "react";

import {
  ClaveCampoFila,
  ConfiguracionEjes,
  ConfiguracionNombresDiagrama,
  DatoBurbuja,
  FilaBurbujaEditable,
} from "@/types/diagrama";
import {
  claveCelda,
  colorPredeterminado,
  crearFilaVacia,
  LIMITE_FILAS,
  procesarBloquePegado,
  validarYTransformarFilas,
} from "@/utils/numeros";
import { calcularConfiguracionEjesAutomatica } from "@/utils/ejes";

interface ResultadoPegado {
  mensaje?: string;
}

export function useEstadoDiagramaBurbuja() {
  const [contadorFilas, setContadorFilas] = useState(3);
  const [filas, setFilas] = useState<FilaBurbujaEditable[]>([
    crearFilaVacia("fila-1"),
    crearFilaVacia("fila-2"),
  ]);
  const [celdasInvalidas, setCeldasInvalidas] = useState<Set<string>>(new Set());
  const [mensaje, setMensaje] = useState<string>("");
  const [diagramaGenerado, setDiagramaGenerado] = useState(false);
  const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(null);

  const [nombresDiagrama, setNombresDiagrama] = useState<ConfiguracionNombresDiagrama>({
    titulo: "Tamaño de la burbuja",
    ejeX: "Eje X",
    ejeY: "Eje Y",
    variableTamano: "Tamaño de la burbuja",
  });

  const [datosGraficos, setDatosGraficos] = useState<DatoBurbuja[]>([]);

  const [configuracionEjes, setConfiguracionEjes] = useState<ConfiguracionEjes>({
    ejeX: { inicio: 0, maximo: 10, unidadPrincipal: 2 },
    ejeY: { inicio: 0, maximo: 10, unidadPrincipal: 2 },
  });

  const cantidadFilas = filas.length;
  const puedeAgregarFila = cantidadFilas < LIMITE_FILAS;

  const hayDatosParaExportar = useMemo(() => diagramaGenerado && datosGraficos.length > 0, [diagramaGenerado, datosGraficos.length]);

  function actualizarValorCelda(filaId: string, campo: ClaveCampoFila, valor: string): void {
    setFilas((estadoAnterior) =>
      estadoAnterior.map((fila) => (fila.id === filaId ? { ...fila, [campo]: valor } : fila))
    );

    setCeldasInvalidas((estadoAnterior) => {
      const actualizadas = new Set(estadoAnterior);
      const claveActual = claveCelda(filaId, campo);
      const valorNormalizado = valor.trim().replace(",", ".");

      if (valor.trim() === "") {
        actualizadas.delete(claveActual);
      } else if (!Number.isFinite(Number(valorNormalizado))) {
        actualizadas.add(claveActual);
      } else {
        actualizadas.delete(claveActual);
      }

      return actualizadas;
    });

    if (mensaje) {
      setMensaje("");
    }
  }

  function agregarFila(): void {
    if (!puedeAgregarFila) {
      setMensaje("Llegaste al máximo de 20 filas.");
      return;
    }

    const nuevoId = `fila-${contadorFilas}`;
    setContadorFilas((actual) => actual + 1);
    setFilas((estadoAnterior) => [...estadoAnterior, crearFilaVacia(nuevoId)]);
  }

  function eliminarFila(filaId: string): void {
    if (filas.length <= 1) {
      setMensaje("Debe existir al menos una fila en la tabla.");
      return;
    }

    setFilas((estadoAnterior) => estadoAnterior.filter((fila) => fila.id !== filaId));
    setCeldasInvalidas((estadoAnterior) => {
      const actualizadas = new Set<string>();
      estadoAnterior.forEach((clave) => {
        if (!clave.startsWith(`${filaId}-`)) {
          actualizadas.add(clave);
        }
      });
      return actualizadas;
    });
    setMensaje("");
  }

  function aplicarPegadoDesdeExcel(
    textoPegado: string,
    filaInicio: number,
    indiceCampoInicio: number
  ): ResultadoPegado {
    const matrizPegada = procesarBloquePegado(textoPegado);
    if (matrizPegada.length === 0) {
      return { mensaje: "No se detectaron datos válidos para pegar." };
    }

    const campos: ClaveCampoFila[] = ["valorX", "valorY", "valorTamano"];
    let filasActualizadas = [...filas];
    let numeroCeldasNoNumericas = 0;
    let numeroCeldasPegadas = 0;
    const celdasInvalidasLocales = new Set(celdasInvalidas);

    for (let i = 0; i < matrizPegada.length; i += 1) {
      const indiceFilaObjetivo = filaInicio + i;

      if (indiceFilaObjetivo >= LIMITE_FILAS) {
        break;
      }

      if (!filasActualizadas[indiceFilaObjetivo]) {
        const nuevoId = `fila-${contadorFilas + indiceFilaObjetivo - filas.length}`;
        filasActualizadas.push(crearFilaVacia(nuevoId));
      }

      for (let j = 0; j < matrizPegada[i].length; j += 1) {
        const indiceCampo = indiceCampoInicio + j;
        if (indiceCampo >= campos.length) {
          continue;
        }

        const campo = campos[indiceCampo];
        const valorCrudo = matrizPegada[i][j].trim();

        if (valorCrudo === "") {
          continue;
        }

        filasActualizadas[indiceFilaObjetivo] = {
          ...filasActualizadas[indiceFilaObjetivo],
          [campo]: valorCrudo,
        };
        numeroCeldasPegadas += 1;

        const numero = Number(valorCrudo.replace(",", "."));
        const claveActual = claveCelda(filasActualizadas[indiceFilaObjetivo].id, campo);
        if (!Number.isFinite(numero)) {
          numeroCeldasNoNumericas += 1;
          celdasInvalidasLocales.add(claveActual);
        } else {
          celdasInvalidasLocales.delete(claveActual);
        }
      }
    }

    const cantidadAnterior = filas.length;
    const cantidadNueva = filasActualizadas.length;
    if (cantidadNueva > cantidadAnterior) {
      setContadorFilas((actual) => actual + (cantidadNueva - cantidadAnterior));
    }

    if (filasActualizadas.length > LIMITE_FILAS) {
      filasActualizadas = filasActualizadas.slice(0, LIMITE_FILAS);
    }

    setFilas(filasActualizadas);
  setCeldasInvalidas(celdasInvalidasLocales);

    if (numeroCeldasNoNumericas > 0) {
      return {
        mensaje: `Se pegaron ${numeroCeldasPegadas} celdas. ${numeroCeldasNoNumericas} celdas no son numéricas y quedaron marcadas.`,
      };
    }

    if (filaInicio + matrizPegada.length > LIMITE_FILAS) {
      return {
        mensaje: "El pegado superó 20 filas. Solo se tomaron las primeras 20 filas permitidas.",
      };
    }

    return {
      mensaje: `Se pegaron ${numeroCeldasPegadas} celdas correctamente.`,
    };
  }

  function generarDiagrama(): boolean {
    const coloresActuales = filas.map((fila) => {
      const dato = datosGraficos.find((item) => item.id === fila.id);
      return dato?.color ?? colorPredeterminado(0);
    });

    const resultado = validarYTransformarFilas(filas, coloresActuales);
    setCeldasInvalidas(resultado.celdasInvalidas);

    if (resultado.mensajeError) {
      setMensaje(resultado.mensajeError);
      setDiagramaGenerado(false);
      return false;
    }

    const datosConColor = resultado.datosValidos.map((dato, indice) => {
      const colorAnterior = datosGraficos.find((item) => item.id === dato.id)?.color;
      return {
        ...dato,
        color: colorAnterior ?? colorPredeterminado(indice),
      };
    });

    setDatosGraficos(datosConColor);
    setDiagramaGenerado(true);
    setIndiceSeleccionado(datosConColor.length > 0 ? 0 : null);

    const nuevoEje = calcularConfiguracionEjesAutomatica(datosConColor);
    setConfiguracionEjes((actual) => {
      if (actual.ejeX.maximo <= actual.ejeX.inicio || actual.ejeX.unidadPrincipal <= 0) {
        return nuevoEje;
      }
      if (actual.ejeY.maximo <= actual.ejeY.inicio || actual.ejeY.unidadPrincipal <= 0) {
        return nuevoEje;
      }
      return actual;
    });

    setMensaje("Diagrama generado correctamente.");
    return true;
  }

  function cambiarNombreDiagrama(campo: keyof ConfiguracionNombresDiagrama, valor: string): void {
    setNombresDiagrama((actual) => ({ ...actual, [campo]: valor }));
  }

  function seleccionarBurbuja(indice: number): void {
    setIndiceSeleccionado(indice);
  }

  function cambiarColorBurbujaSeleccionada(color: string): void {
    if (indiceSeleccionado === null) {
      setMensaje("Selecciona una burbuja para cambiar su color.");
      return;
    }

    setDatosGraficos((actuales) =>
      actuales.map((dato, indice) => (indice === indiceSeleccionado ? { ...dato, color } : dato))
    );
  }

  function cambiarConfiguracionEje(
    eje: keyof ConfiguracionEjes,
    campo: "inicio" | "maximo" | "unidadPrincipal",
    valor: number
  ): void {
    setConfiguracionEjes((actual) => ({
      ...actual,
      [eje]: {
        ...actual[eje],
        [campo]: Number.isFinite(valor) ? valor : 0,
      },
    }));
  }

  return {
    filas,
    cantidadFilas,
    puedeAgregarFila,
    celdasInvalidas,
    mensaje,
    diagramaGenerado,
    nombresDiagrama,
    datosGraficos,
    indiceSeleccionado,
    configuracionEjes,
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
    limpiarMensaje: () => setMensaje(""),
    setMensaje,
  };
}