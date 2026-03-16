export type ClaveCampoFila = "valorX" | "valorY" | "valorTamano";

export interface FilaBurbujaEditable {
  id: string;
  valorX: string;
  valorY: string;
  valorTamano: string;
}

export interface DatoBurbuja {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

export interface ConfiguracionNombresDiagrama {
  titulo: string;
  ejeX: string;
  ejeY: string;
  variableTamano: string;
}

export interface ConfiguracionEje {
  inicio: number;
  maximo: number;
  unidadPrincipal: number;
}

export interface ConfiguracionEjes {
  ejeX: ConfiguracionEje;
  ejeY: ConfiguracionEje;
}

export interface ResultadoValidacionFilas {
  datosValidos: DatoBurbuja[];
  celdasInvalidas: Set<string>;
  mensajeError?: string;
}