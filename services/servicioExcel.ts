import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { ConfiguracionNombresDiagrama, DatoBurbuja } from "@/types/diagrama";

interface ParametrosExportacionExcel {
  datos: DatoBurbuja[];
  nombres: ConfiguracionNombresDiagrama;
  imagenGraficoBase64?: string;
}

export async function exportarDiagramaBurbujaAExcel({
  datos,
  nombres,
  imagenGraficoBase64,
}: ParametrosExportacionExcel): Promise<void> {
  const libro = new ExcelJS.Workbook();
  libro.creator = "Diagramador de Burbujas";
  libro.created = new Date();

  const hoja = libro.addWorksheet("Diagrama Burbujas", {
    properties: {
      defaultRowHeight: 20,
    },
  });

  hoja.columns = [
    { header: nombres.ejeX, key: "x", width: 18 },
    { header: nombres.ejeY, key: "y", width: 18 },
    { header: nombres.variableTamano, key: "z", width: 24 },
    { header: "Color burbuja", key: "color", width: 18 },
  ];

  hoja.mergeCells("A1:D1");
  const celdaTitulo = hoja.getCell("A1");
  celdaTitulo.value = nombres.titulo;
  celdaTitulo.font = { name: "Segoe UI", size: 16, bold: true, color: { argb: "FF1E5A3C" } };
  celdaTitulo.alignment = { vertical: "middle", horizontal: "center" };
  celdaTitulo.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE6EFE8" },
  };

  const filaEncabezado = hoja.getRow(3);
  filaEncabezado.values = [nombres.ejeX, nombres.ejeY, nombres.variableTamano, "Color burbuja"];
  filaEncabezado.font = { name: "Segoe UI", bold: true, color: { argb: "FF1E3F2F" } };
  filaEncabezado.alignment = { vertical: "middle", horizontal: "center" };
  filaEncabezado.eachCell((celda) => {
    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBE8DE" },
    };
    celda.border = bordesTabla;
  });

  datos.forEach((dato, indice) => {
    const numeroFila = indice + 4;
    const fila = hoja.getRow(numeroFila);
    fila.values = [dato.x, dato.y, dato.z, dato.color];
    fila.eachCell((celda, indiceCelda) => {
      celda.border = bordesTabla;
      celda.alignment = { vertical: "middle", horizontal: "center" };
      celda.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: indice % 2 === 0 ? "FFF4F9F5" : "FFFFFFFF" },
      };

      if (indiceCelda === 4) {
        const colorSinNumeral = dato.color.replace("#", "").toUpperCase();
        if (/^[0-9A-F]{6}$/.test(colorSinNumeral)) {
          celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${colorSinNumeral}` },
          };
          celda.font = { color: { argb: "FF000000" }, bold: true };
        }
      }
    });
  });

  const ultimaFilaDatos = Math.max(4, datos.length + 3);
  hoja.getCell(`A${ultimaFilaDatos + 2}`).value = "Resumen";
  hoja.getCell(`A${ultimaFilaDatos + 2}`).font = { bold: true, color: { argb: "FF1E5A3C" } };

  hoja.getCell(`A${ultimaFilaDatos + 3}`).value = "Título";
  hoja.getCell(`B${ultimaFilaDatos + 3}`).value = nombres.titulo;
  hoja.getCell(`A${ultimaFilaDatos + 4}`).value = "Nombre eje X";
  hoja.getCell(`B${ultimaFilaDatos + 4}`).value = nombres.ejeX;
  hoja.getCell(`A${ultimaFilaDatos + 5}`).value = "Nombre eje Y";
  hoja.getCell(`B${ultimaFilaDatos + 5}`).value = nombres.ejeY;
  hoja.getCell(`A${ultimaFilaDatos + 6}`).value = "Variable tamaño";
  hoja.getCell(`B${ultimaFilaDatos + 6}`).value = nombres.variableTamano;

  if (imagenGraficoBase64) {
    const filaTituloGrafico = ultimaFilaDatos + 8;
    hoja.mergeCells(`A${filaTituloGrafico}:D${filaTituloGrafico}`);
    const celdaTituloGrafico = hoja.getCell(`A${filaTituloGrafico}`);
    celdaTituloGrafico.value = `Diagrama de burbujas - ${nombres.titulo}`;
    celdaTituloGrafico.font = { name: "Segoe UI", bold: true, color: { argb: "FF1E5A3C" } };
    celdaTituloGrafico.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEAF3ED" },
    };
    celdaTituloGrafico.alignment = { vertical: "middle", horizontal: "center" };

    const imagenId = libro.addImage({
      base64: imagenGraficoBase64,
      extension: "png",
    });

    hoja.addImage(imagenId, {
      tl: { col: 0, row: filaTituloGrafico },
      ext: { width: 940, height: 520 },
      editAs: "oneCell",
    });
  }

  const contenido = await libro.xlsx.writeBuffer();
  const blob = new Blob([contenido], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fecha = new Date();
  const marca = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(
    fecha.getDate()
  ).padStart(2, "0")}`;

  saveAs(blob, `diagrama-burbujas-${marca}.xlsx`);
}

const bordesTabla: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFD3DED6" } },
  left: { style: "thin", color: { argb: "FFD3DED6" } },
  bottom: { style: "thin", color: { argb: "FFD3DED6" } },
  right: { style: "thin", color: { argb: "FFD3DED6" } },
};