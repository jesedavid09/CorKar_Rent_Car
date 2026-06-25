const PDFDocument = require('pdfkit');
const prisma      = require('../../config/prisma');

const buildPDF = (res, title, reservation, tipo) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${tipo}_${reservation.id}.pdf"`);

  doc.pipe(res);

  doc.fontSize(22).font('Helvetica-Bold').text('CorKar Rent Car', { align: 'center' });
  doc.fontSize(14).font('Helvetica').text(title, { align: 'center' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.fontSize(12).font('Helvetica-Bold').text('Cliente:');
  doc.font('Helvetica').text(`${reservation.user.nombre} ${reservation.user.apellido}`);
  doc.text(`Email: ${reservation.user.email}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text('Vehículo:');
  doc.font('Helvetica').text(`${reservation.vehicle.marca} ${reservation.vehicle.modelo} (${reservation.vehicle.anio})`);
  doc.text(`Placa: ${reservation.vehicle.placa}`);
  doc.moveDown();

  doc.font('Helvetica-Bold').text('Detalles de la renta:');
  doc.font('Helvetica').text(`Fecha inicio: ${reservation.fechaInicio.toLocaleDateString('es-DO')}`);
  doc.text(`Fecha fin:    ${reservation.fechaFin.toLocaleDateString('es-DO')}`);
  doc.text(`Días totales: ${reservation.diasTotal}`);
  doc.text(`Precio/día:   RD$ ${reservation.vehicle.precioDia}`);
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold')
     .text(`TOTAL: RD$ ${reservation.costoTotal}`, { align: 'right' });

  doc.end();
};

const generateQuotation = async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where:   { id: req.params.reservationId },
      include: { user: true, vehicle: true }
    });
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });

    buildPDF(res, 'COTIZACIÓN', reservation, 'cotizacion');
  } catch (error) {
    res.status(500).json({ error: 'Error generando cotización' });
  }
};

const generateContract = async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where:   { id: req.params.reservationId },
      include: { user: true, vehicle: true }
    });
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });

    buildPDF(res, 'CONTRATO DE ALQUILER', reservation, 'contrato');
  } catch (error) {
    res.status(500).json({ error: 'Error generando contrato' });
  }
};

module.exports = { generateQuotation, generateContract };