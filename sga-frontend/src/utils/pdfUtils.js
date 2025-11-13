import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadSchedulePdf(enrollments, user) {
  if (!enrollments || enrollments.length === 0) {
    alert('No hay inscripciones para generar el PDF.');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');

  const title = 'Horario de Clases - Estudiante';
  const studentName = user?.nombre || '';
  const studentEmail = user?.correo || '';
  const today = new Date().toLocaleDateString();

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  doc.setFontSize(11);
  doc.text(`Nombre: ${studentName}`, 14, 30);
  doc.text(`Correo: ${studentEmail}`, 14, 36);
  doc.text(`Fecha de generación: ${today}`, 14, 42);

  const tableColumn = [
    'Asignatura',
    'Profesor',
    'Horario',
    'Salón',
    'Fecha inscripción'
  ];

  const tableRows = enrollments.map((e) => {
    const subjectName = e.clase?.asignatura?.nombre || '-';
    const profesorName = e.clase?.profesor
      ? `${e.clase.profesor.nombre} (${e.clase.profesor.correo})`
      : '-';
    const horario = e.clase?.horario || '-';
    const salon = e.clase?.salon || '-';
    const fecha = e.fecha_inscripcion || '-';

    return [subjectName, profesorName, horario, salon, fecha];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    styles: {
      fontSize: 9
    },
    headStyles: {
      fillColor: [37, 99, 235]
    }
  });

  const fileName = `horario-${(studentName || 'estudiante')
    .toLowerCase()
    .replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}

/**
 * PDF para PROFESOR: lista de inscriptos por clase
 */
export function downloadProfessorEnrollmentsPdf(enrollments, user) {
  if (!enrollments || enrollments.length === 0) {
    alert('No hay inscripciones para generar el PDF.');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const title = 'Listado de inscripciones por clase';
  const profName = user?.nombre || '';
  const profEmail = user?.correo || '';
  const today = new Date().toLocaleDateString();

  doc.setFontSize(16);
  doc.text(title, 14, 20);

  doc.setFontSize(11);
  doc.text(`Profesor: ${profName}`, 14, 30);
  doc.text(`Correo: ${profEmail}`, 14, 36);
  doc.text(`Fecha de generación: ${today}`, 14, 42);

  // Agrupar inscripciones por clase
  const groups = {};
  enrollments.forEach((e) => {
    const claseId = e.id_clase;
    if (!groups[claseId]) {
      groups[claseId] = {
        clase: e.clase,
        items: []
      };
    }
    groups[claseId].items.push(e);
  });

  let currentY = 50;

  Object.values(groups).forEach((group, index) => {
    const clase = group.clase;
    const heading = clase?.asignatura
      ? `${clase.asignatura.nombre} — ${clase.horario} — ${clase.salon}`
      : `Clase #${clase?.id || ''}`;

    if (index > 0) {
      currentY = doc.lastAutoTable?.finalY
        ? doc.lastAutoTable.finalY + 10
        : currentY + 10;
    }

    // Nueva página si nos quedamos sin espacio
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.text(`Clase: ${heading}`, 14, currentY);

    const tableRows = group.items.map((e) => [
      e.estudiante ? e.estudiante.nombre : '-',
      e.estudiante ? e.estudiante.correo : '-',
      e.fecha_inscripcion || '-'
    ]);

    autoTable(doc, {
      head: [['Estudiante', 'Correo', 'Fecha inscripción']],
      body: tableRows,
      startY: currentY + 4,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [15, 23, 42]
      }
    });

    currentY = doc.lastAutoTable.finalY + 6;
  });

  const fileName = `inscripciones-${(profName || 'profesor')
    .toLowerCase()
    .replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
