"use client";

import { ConfiguracionNombresDiagrama } from "@/types/diagrama";

interface PropiedadesFormularioConfiguracionDiagrama {
  nombres: ConfiguracionNombresDiagrama;
  alCambiarNombre: (campo: keyof ConfiguracionNombresDiagrama, valor: string) => void;
}

export function FormularioConfiguracionDiagrama({
  nombres,
  alCambiarNombre,
}: PropiedadesFormularioConfiguracionDiagrama) {
  return (
    <section className="tarjeta" aria-label="Configuración de nombres del diagrama">
      <h3>Editar nombres del diagrama</h3>
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="titulo">Título del gráfico</label>
          <input
            id="titulo"
            className="entrada-texto"
            value={nombres.titulo}
            onChange={(evento) => alCambiarNombre("titulo", evento.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="ejeX">Nombre eje X</label>
          <input
            id="ejeX"
            className="entrada-texto"
            value={nombres.ejeX}
            onChange={(evento) => alCambiarNombre("ejeX", evento.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="ejeY">Nombre eje Y</label>
          <input
            id="ejeY"
            className="entrada-texto"
            value={nombres.ejeY}
            onChange={(evento) => alCambiarNombre("ejeY", evento.target.value)}
          />
        </div>
        <div className="campo">
          <label htmlFor="variableTamano">Variable de tamaño</label>
          <input
            id="variableTamano"
            className="entrada-texto"
            value={nombres.variableTamano}
            onChange={(evento) => alCambiarNombre("variableTamano", evento.target.value)}
          />
        </div>
      </div>
    </section>
  );
}