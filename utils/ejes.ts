import { ConfiguracionEje, ConfiguracionEjes, DatoBurbuja } from "@/types/diagrama";

export function construirTicks(eje: ConfiguracionEje): number[] {
  if (eje.unidadPrincipal <= 0 || eje.maximo < eje.inicio) {
    return [];
  }

  const ticks: number[] = [];
  let valorActual = eje.inicio;
  const limite = 2000;
  let iteraciones = 0;

  while (valorActual <= eje.maximo + 1e-8 && iteraciones < limite) {
    ticks.push(redondear(valorActual));
    valorActual += eje.unidadPrincipal;
    iteraciones += 1;
  }

  return ticks;
}

export function calcularConfiguracionEjesAutomatica(datos: DatoBurbuja[]): ConfiguracionEjes {
  const valoresX = datos.map((dato) => dato.x);
  const valoresY = datos.map((dato) => dato.y);

  const minimoX = Math.min(...valoresX);
  const maximoX = Math.max(...valoresX);
  const minimoY = Math.min(...valoresY);
  const maximoY = Math.max(...valoresY);

  return {
    ejeX: construirEje(minimoX, maximoX),
    ejeY: construirEje(minimoY, maximoY),
  };
}

function construirEje(minimo: number, maximo: number): ConfiguracionEje {
  const rango = Math.abs(maximo - minimo);
  const margen = rango === 0 ? Math.max(1, Math.abs(minimo) * 0.25 || 1) : rango * 0.12;

  const inicio = redondear(minimo - margen);
  const maximoConMargen = redondear(maximo + margen);
  const unidadPrincipal = calcularUnidadPrincipal(maximoConMargen - inicio);

  return {
    inicio,
    maximo: maximoConMargen,
    unidadPrincipal,
  };
}

function calcularUnidadPrincipal(rango: number): number {
  if (rango <= 0) {
    return 1;
  }
  const unidad = rango / 5;
  return redondear(unidad > 0 ? unidad : 1);
}

function redondear(valor: number): number {
  return Number(valor.toFixed(4));
}