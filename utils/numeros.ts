import {
  ClaveCampoFila,
  DatoBurbuja,
  FilaBurbujaEditable,
  ResultadoValidacionFilas,
} from "@/types/diagrama";

const CAMPOS_FILA: ClaveCampoFila[] = ["valorX", "valorY", "valorTamano"];

export const LIMITE_FILAS = 20;
export const MINIMO_FILAS = 1;

export function esNumeroValido(valor: string): boolean {
  if (valor.trim() === "") {
    return false;
  }

  const numero = convertirTextoANumero(valor);
  return Number.isFinite(numero);
}

export function convertirTextoANumero(valor: string): number {
  const valorNormalizado = valor.trim().replace(/\s+/g, "").replace(",", ".");
  return Number(valorNormalizado);
}

export function crearFilaVacia(id: string): FilaBurbujaEditable {
  return {
    id,
    valorX: "",
    valorY: "",
    valorTamano: "",
  };
}

export function claveCelda(filaId: string, campo: ClaveCampoFila): string {
  return `${filaId}-${campo}`;
}

export function procesarBloquePegado(textoPegado: string): string[][] {
  return textoPegado
    .trim()
    .split(/\r?\n/)
    .filter((fila) => fila.length > 0)
    .map((fila) => fila.split("\t").slice(0, 3));
}

export function validarYTransformarFilas(
  filas: FilaBurbujaEditable[],
  coloresExistentes: string[]
): ResultadoValidacionFilas {
  const celdasInvalidas = new Set<string>();
  const datosValidos: DatoBurbuja[] = [];

  filas.forEach((fila, indiceFila) => {
    const valores = CAMPOS_FILA.map((campo) => fila[campo].trim());
    const filaVacia = valores.every((valor) => valor === "");

    if (filaVacia) {
      return;
    }

    const filaIncompleta = valores.some((valor) => valor === "");
    if (filaIncompleta) {
      CAMPOS_FILA.forEach((campo) => {
        if (fila[campo].trim() === "") {
          celdasInvalidas.add(claveCelda(fila.id, campo));
        }
      });
      return;
    }

    const numeroX = convertirTextoANumero(fila.valorX);
    const numeroY = convertirTextoANumero(fila.valorY);
    const numeroTamano = convertirTextoANumero(fila.valorTamano);

    if (!Number.isFinite(numeroX)) {
      celdasInvalidas.add(claveCelda(fila.id, "valorX"));
    }
    if (!Number.isFinite(numeroY)) {
      celdasInvalidas.add(claveCelda(fila.id, "valorY"));
    }
    if (!Number.isFinite(numeroTamano) || numeroTamano < 0) {
      celdasInvalidas.add(claveCelda(fila.id, "valorTamano"));
    }

    if (Number.isFinite(numeroX) && Number.isFinite(numeroY) && Number.isFinite(numeroTamano) && numeroTamano >= 0) {
      datosValidos.push({
        id: fila.id,
        x: numeroX,
        y: numeroY,
        z: numeroTamano,
        color: coloresExistentes[indiceFila] ?? colorPredeterminado(indiceFila),
      });
    }
  });

  if (celdasInvalidas.size > 0) {
    return {
      datosValidos: [],
      celdasInvalidas,
      mensajeError:
        "Hay celdas incompletas o con valores no numéricos. Corrige los campos marcados.",
    };
  }

  if (datosValidos.length < MINIMO_FILAS) {
    return {
      datosValidos: [],
      celdasInvalidas,
      mensajeError:
        "Debes ingresar al menos una fila completa y numérica para generar el diagrama.",
    };
  }

  return {
    datosValidos,
    celdasInvalidas,
  };
}

export function colorPredeterminado(indice: number): string {
  const paleta = [
    "#1e5a3c",
    "#2f7d56",
    "#4a9c72",
    "#70b08b",
    "#8ec3a1",
    "#b2d5be",
    "#6e8f79",
    "#476a55",
  ];
  return paleta[indice % paleta.length];
}