const bcrypt = require('bcryptjs');
const { sequelize, User, Subject, Class, Enrollment } = require('./models');

async function seed() {
  try {
    console.log('🔄 Reiniciando base de datos...');
    await sequelize.sync({ force: true }); // ⚠️ Borra y recrea todas las tablas

    console.log('👤 Creando usuarios...');
    const adminPassword = await bcrypt.hash('123456', 10);
    const profesorPassword = await bcrypt.hash('123456', 10);
    const estudiantePassword = await bcrypt.hash('123456', 10);

    const admin = await User.create({
      nombre: 'Admin Principal',
      correo: 'admin@sga.com',
      contraseña: adminPassword,
      rol: 'admin'
    });

    const profesor = await User.create({
      nombre: 'Ana Profesor',
      correo: 'ana.profesor@sga.com',
      contraseña: profesorPassword,
      rol: 'profesor'
    });

    const estudiante = await User.create({
      nombre: 'Juan Estudiante',
      correo: 'juan.estudiante@sga.com',
      contraseña: estudiantePassword,
      rol: 'estudiante'
    });

    console.log('📚 Creando asignaturas...');
    const prog1 = await Subject.create({
      nombre: 'Programación I',
      descripcion: 'Introducción a la programación estructurada'
    });

    const prog2 = await Subject.create({
      nombre: 'Programación II',
      descripcion: 'Programación orientada a objetos'
    });

    const bd1 = await Subject.create({
      nombre: 'Bases de Datos I',
      descripcion: 'Modelo relacional y SQL'
    });

    console.log('🏫 Creando clases...');
    const clase1 = await Class.create({
      id_asignatura: prog1.id,
      id_profesor: profesor.id,
      horario: 'Lunes 10:00 - 12:00',
      salon: 'Aula 101'
    });

    const clase2 = await Class.create({
      id_asignatura: prog2.id,
      id_profesor: profesor.id,
      horario: 'Miércoles 14:00 - 16:00',
      salon: 'Aula 203'
    });

    const clase3 = await Class.create({
      id_asignatura: bd1.id,
      id_profesor: profesor.id,
      horario: 'Viernes 08:00 - 10:00',
      salon: 'Laboratorio 3'
    });

    console.log('📝 Creando inscripciones...');
    await Enrollment.create({
      id_usuario: estudiante.id,
      id_clase: clase1.id,
      fecha_inscripcion: new Date()
    });

    await Enrollment.create({
      id_usuario: estudiante.id,
      id_clase: clase3.id,
      fecha_inscripcion: new Date()
    });

    console.log('✅ Seed completado con éxito.');
    console.log('🔑 Usuarios de prueba (contraseña 123456):');
    console.log(`   Admin: ${admin.correo}`);
    console.log(`   Profesor: ${profesor.correo}`);
    console.log(`   Estudiante: ${estudiante.correo}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
