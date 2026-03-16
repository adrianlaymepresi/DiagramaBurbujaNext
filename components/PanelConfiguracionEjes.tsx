"use client";

import { ConfiguracionEjes } from "@/types/diagrama";

interface PropiedadesPanelConfiguracionEjes {
  configuracionEjes: ConfiguracionEjes;
  alCambiarEje: (
    eje: keyof ConfiguracionEjes,
    campo: "inicio" | "maximo" | "unidadPrincipal",
    valor: number
  ) => void;
}

export function PanelConfiguracionEjes({
  configuracionEjes,
  alCambiarEje,
}: PropiedadesPanelConfiguracionEjes) {
  return (
    <section className="tarjeta" aria-label="Configuración manual de ejes">
      <h3>Configuración manual de ejes</h3>
      <div className="grupo-campos">
        <CampoEje
          titulo="Eje X"
          prefijoId="x"
          valores={configuracionEjes.ejeX}
          alCambiar={(campo, valor) => alCambiarEje("ejeX", campo, valor)}
        />
        <CampoEje
          titulo="Eje Y"
          prefijoId="y"
          valores={configuracionEjes.ejeY}
          alCambiar={(campo, valor) => alCambiarEje("ejeY", campo, valor)}
        />
      </div>
    </section>
  );
}

interface PropiedadesCampoEje {
  titulo: string;
  prefijoId: string;
  valores: ConfiguracionEjes["ejeX"];
  alCambiar: (campo: "inicio" | "maximo" | "unidadPrincipal", valor: number) => void;
}

function CampoEje({ titulo, prefijoId, valores, alCambiar }: PropiedadesCampoEje) {
  return (
    <div className="tarjeta" style={{ margin: 0 }}>
      <h3>{titulo}</h3>
      <div className="campo">
        <label htmlFor={`${prefijoId}-inicio`}>Valor inicial</label>
        <input
          id={`${prefijoId}-inicio`}
          type="number"
          className="entrada-numero"
          value={valores.inicio}
          onChange={(evento) => alCambiar("inicio", Number(evento.target.value))}
        />
      </div>
      <div className="campo">
        <label htmlFor={`${prefijoId}-maximo`}>Valor máximo</label>
        <input
          id={`${prefijoId}-maximo`}
          type="number"
          className="entrada-numero"
          value={valores.maximo}
          onChange={(evento) => alCambiar("maximo", Number(evento.target.value))}
        />
      </div>
      <div className="campo">
        <label htmlFor={`${prefijoId}-unidad`}>Unidad principal</label>
        <input
          id={`${prefijoId}-unidad`}
          type="number"
          min={0.0001}
          step="any"
          className="entrada-numero"
          value={valores.unidadPrincipal}
          onChange={(evento) => alCambiar("unidadPrincipal", Number(evento.target.value))}
        />
      </div>
    </div>
  );
}