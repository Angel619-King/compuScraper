import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BotonesExportar = ({ datos = [] }) => {
  // Función para validar y formatear datos
  const prepararDatos = () => {
    if (!Array.isArray(datos) || datos.length === 0) {
      return null;
    }

    return datos.map(item => ({
      titulo: item.titulo || 'No especificado',
      empresa: item.empresa || 'No especificado',
      ubicacion: item.ubicacion || 'No especificado',
      salario: item.salario || 'No especificado',
      publicado: item.publicado || 'No especificado'
    }));
  };

  const exportarExcel = () => {
    try {
      const datosFormateados = prepararDatos();
      if (!datosFormateados) {
        alert('No hay datos válidos para exportar a Excel');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ofertas");
      XLSX.writeFile(workbook, "ofertas_empleo.xlsx");
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('Error al generar el archivo Excel');
    }
  };

  const exportarPDF = () => {
    try {
      const datosFormateados = prepararDatos();
      if (!datosFormateados) {
        alert('No hay datos válidos para exportar a PDF');
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });

      // Título del documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Reporte de Ofertas de Empleo', 105, 15, { align: 'center' });

      // Tabla con autoTable
      autoTable(doc, {
        startY: 25,
        head: [['Título', 'Empresa', 'Ubicación', 'Salario', 'Fecha']],
        body: datosFormateados.map(item => [
          item.titulo,
          item.empresa,
          item.ubicacion,
          item.salario,
          item.publicado
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 20 }
      });

      // Pie de página con número de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Página ${i} de ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      doc.save('ofertas_empleo.pdf');
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      alert('Error al generar el archivo PDF');
    }
  };

  const exportarCSV = () => {
    try {
      const datosFormateados = prepararDatos();
      if (!datosFormateados) {
        alert('No hay datos válidos para exportar a CSV');
        return;
      }

      const headers = ['Título', 'Empresa', 'Ubicación', 'Salario', 'Fecha'];
      const csvRows = datosFormateados.map(item => [
        `"${item.titulo.replace(/"/g, '""')}"`,
        `"${item.empresa.replace(/"/g, '""')}"`,
        `"${item.ubicacion.replace(/"/g, '""')}"`,
        `"${item.salario.replace(/"/g, '""')}"`,
        `"${item.publicado.replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'ofertas_empleo.csv');
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      alert('Error al generar el archivo CSV');
    }
  };

  return (
    <div className="botones-exportar">
      <button 
        className="btn-export excel" 
        onClick={exportarExcel}
        disabled={!datos || datos.length === 0}
      >
        Exportar Excel
      </button>
      <button 
        className="btn-export pdf" 
        onClick={exportarPDF}
        disabled={!datos || datos.length === 0}
      >
        Exportar PDF
      </button>
      <button 
        className="btn-export csv" 
        onClick={exportarCSV}
        disabled={!datos || datos.length === 0}
      >
        Exportar CSV
      </button>
    </div>
  );
};

export default BotonesExportar;
