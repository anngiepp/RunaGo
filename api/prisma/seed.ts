import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ORGANIZADOR_PASSWORD } = process.env;

if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'Faltan variables en api/.env: DATABASE_URL, ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias.',
  );
  process.exit(1);
}

const admin = { correo: ADMIN_EMAIL, contrasena: ADMIN_PASSWORD };
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });

const categorias = [
  'Rock',
  'Indie',
  'Jazz',
  'Electrónica',
  'Hip hop',
  'Arte urbano',
  'Gastronomía',
  'Teatro',
  'Cine',
  'Ferias',
  'Cultura andina',
  'Deporte',
  'Bienestar',
  'Festivales',
  'Cultura general',
];

// Coordenadas aproximadas: verificar antes de usarlas en producción
const lugares = [
  {
    nombre: 'Teatro Municipal de Lima',
    direccion: 'Jr. Ica 377',
    distrito: 'Cercado de Lima',
    latitud: -12.0471,
    longitud: -77.036,
  },
  {
    nombre: 'Museo de Arte de Lima (MALI)',
    direccion: 'Paseo Colón 125',
    distrito: 'Cercado de Lima',
    latitud: -12.0605,
    longitud: -77.0372,
  },
  {
    nombre: 'Parque de la Reserva',
    direccion: 'Av. Petit Thouars s/n',
    distrito: 'Cercado de Lima',
    latitud: -12.0703,
    longitud: -77.0339,
  },
  {
    nombre: 'Gran Teatro Nacional',
    direccion: 'Av. Javier Prado Este 2225',
    distrito: 'San Borja',
    latitud: -12.0865,
    longitud: -77.001,
  },
  {
    nombre: 'Parque Kennedy',
    direccion: 'Av. José Larco s/n',
    distrito: 'Miraflores',
    latitud: -12.1211,
    longitud: -77.0296,
  },
  {
    nombre: 'Centro Cultural Británico',
    direccion: 'Jr. Bellavista 531',
    distrito: 'Miraflores',
    latitud: -12.1219,
    longitud: -77.0285,
  },
  {
    nombre: 'Bajada de Baños',
    direccion: 'Bajada de Baños s/n',
    distrito: 'Barranco',
    latitud: -12.1495,
    longitud: -77.0228,
  },
  {
    nombre: 'Mercado N.º 1 de Surquillo',
    direccion: 'Av. Paseo de la República con Av. Ricardo Palma',
    distrito: 'Surquillo',
    latitud: -12.1129,
    longitud: -77.0257,
  },
];

type EventoEjemplo = {
  titulo: string;
  categoria: string;
  lugar: number;
  dias: number;
  hora: number;
  horas: number;
  precio: number | null;
  etiquetas: string[];
  descripcion: string;
};

const eventos: EventoEjemplo[] = [
  {
    titulo: 'Noche de Guitarras Eléctricas Vol. 3',
    categoria: 'Rock',
    lugar: 6,
    dias: 3,
    hora: 20,
    horas: 3,
    precio: 35,
    etiquetas: ['rock', 'en vivo'],
    descripcion: 'Tres bandas inventadas tocan sus mejores riffs frente al mar.',
  },
  {
    titulo: 'Rock en la Reserva: Bandas Emergentes',
    categoria: 'Rock',
    lugar: 2,
    dias: 12,
    hora: 17,
    horas: 5,
    precio: 25,
    etiquetas: ['rock', 'bandas nuevas'],
    descripcion: 'Una tarde para descubrir bandas emergentes que todavía no existen.',
  },
  {
    titulo: 'Sesiones Indie al Atardecer',
    categoria: 'Indie',
    lugar: 6,
    dias: 5,
    hora: 18,
    horas: 3,
    precio: 20,
    etiquetas: ['indie', 'acústico'],
    descripcion: 'Guitarras suaves y canciones propias mientras se oculta el sol.',
  },
  {
    titulo: 'Indie Pop Miraflores: Edición Ficticia',
    categoria: 'Indie',
    lugar: 5,
    dias: 18,
    hora: 19,
    horas: 3,
    precio: 30,
    etiquetas: ['indie', 'pop'],
    descripcion: 'Un cartel inventado de indie pop limeño en una sola noche.',
  },
  {
    titulo: 'Jazz de Medianoche en el Centro',
    categoria: 'Jazz',
    lugar: 0,
    dias: 7,
    hora: 21,
    horas: 2,
    precio: 45,
    etiquetas: ['jazz', 'noche'],
    descripcion: 'Un trío imaginario recorre estándares de jazz en el centro de Lima.',
  },
  {
    titulo: 'Cuarteto Imaginario: Jazz y Bossa',
    categoria: 'Jazz',
    lugar: 5,
    dias: 21,
    hora: 20,
    horas: 2,
    precio: 40,
    etiquetas: ['jazz', 'bossa nova'],
    descripcion: 'Jazz y bossa nova a cargo de un cuarteto que solo existe en este seed.',
  },
  {
    titulo: 'Pulso Electrónico: Sunset Set',
    categoria: 'Electrónica',
    lugar: 2,
    dias: 9,
    hora: 16,
    horas: 6,
    precio: 50,
    etiquetas: ['electrónica', 'dj'],
    descripcion: 'Sets de DJs ficticios desde la tarde hasta la noche.',
  },
  {
    titulo: 'Sintetizadores del Pacífico',
    categoria: 'Electrónica',
    lugar: 6,
    dias: 25,
    hora: 22,
    horas: 4,
    precio: 40,
    etiquetas: ['electrónica', 'synth'],
    descripcion: 'Música hecha en vivo con sintetizadores y cajas de ritmo.',
  },
  {
    titulo: 'Batalla de Rimas Lima Norte-Sur',
    categoria: 'Hip hop',
    lugar: 4,
    dias: 4,
    hora: 17,
    horas: 3,
    precio: null,
    etiquetas: ['hip hop', 'freestyle', 'gratis'],
    descripcion: 'Competencia de freestyle entre MCs inventados. Entrada libre.',
  },
  {
    titulo: 'Beats y Barras: Taller Abierto',
    categoria: 'Hip hop',
    lugar: 5,
    dias: 15,
    hora: 16,
    horas: 2,
    precio: 15,
    etiquetas: ['hip hop', 'taller'],
    descripcion: 'Aprende a armar un beat y escribir tus primeras barras.',
  },
  {
    titulo: 'Muros que Hablan: Recorrido de Grafiti',
    categoria: 'Arte urbano',
    lugar: 6,
    dias: 6,
    hora: 10,
    horas: 2,
    precio: null,
    etiquetas: ['grafiti', 'recorrido', 'gratis'],
    descripcion: 'Caminata guiada por murales de Barranco con historias inventadas.',
  },
  {
    titulo: 'Stencil Lab para Principiantes',
    categoria: 'Arte urbano',
    lugar: 1,
    dias: 19,
    hora: 15,
    horas: 3,
    precio: 20,
    etiquetas: ['stencil', 'taller'],
    descripcion: 'Taller práctico de stencil. Los materiales están incluidos.',
  },
  {
    titulo: 'Ruta del Cebiche Imaginario',
    categoria: 'Gastronomía',
    lugar: 7,
    dias: 2,
    hora: 11,
    horas: 3,
    precio: 30,
    etiquetas: ['comida', 'mercado'],
    descripcion: 'Recorrido de puestos ficticios para probar distintas versiones de cebiche.',
  },
  {
    titulo: 'Feria de Sabores de Mercado',
    categoria: 'Gastronomía',
    lugar: 7,
    dias: 16,
    hora: 9,
    horas: 6,
    precio: null,
    etiquetas: ['comida', 'feria', 'gratis'],
    descripcion: 'Productores inventados ofrecen degustaciones toda la mañana.',
  },
  {
    titulo: 'La Comedia del Puente Roto',
    categoria: 'Teatro',
    lugar: 0,
    dias: 10,
    hora: 20,
    horas: 2,
    precio: 35,
    etiquetas: ['teatro', 'comedia'],
    descripcion: 'Obra ficticia sobre tres vecinos que intentan arreglar un puente.',
  },
  {
    titulo: 'Monólogos de Medianoche',
    categoria: 'Teatro',
    lugar: 3,
    dias: 22,
    hora: 21,
    horas: 2,
    precio: 40,
    etiquetas: ['teatro', 'stand up'],
    descripcion: 'Cinco monologuistas inventados y un micrófono abierto al final.',
  },
  {
    titulo: 'Ciclo de Cine Peruano Inventado',
    categoria: 'Cine',
    lugar: 1,
    dias: 8,
    hora: 19,
    horas: 3,
    precio: null,
    etiquetas: ['cine', 'gratis'],
    descripcion: 'Proyección de cortos ficticios con conversatorio al final.',
  },
  {
    titulo: 'Cine bajo las Estrellas en la Reserva',
    categoria: 'Cine',
    lugar: 2,
    dias: 14,
    hora: 19,
    horas: 3,
    precio: 10,
    etiquetas: ['cine', 'aire libre'],
    descripcion: 'Película al aire libre. Trae tu manta.',
  },
  {
    titulo: 'Feria del Libro Independiente de Miraflores',
    categoria: 'Ferias',
    lugar: 4,
    dias: 11,
    hora: 10,
    horas: 9,
    precio: null,
    etiquetas: ['libros', 'feria', 'gratis'],
    descripcion: 'Editoriales independientes inventadas y fanzines en el parque.',
  },
  {
    titulo: 'Mercadito de Diseño Joven',
    categoria: 'Ferias',
    lugar: 6,
    dias: 24,
    hora: 11,
    horas: 8,
    precio: null,
    etiquetas: ['diseño', 'emprendimiento', 'gratis'],
    descripcion: 'Ropa, ilustración y accesorios de marcas que no existen.',
  },
  {
    titulo: 'Sonidos de los Andes: Concierto de Zampoñas',
    categoria: 'Cultura andina',
    lugar: 3,
    dias: 13,
    hora: 19,
    horas: 2,
    precio: 50,
    etiquetas: ['música andina', 'concierto'],
    descripcion: 'Un ensamble imaginario de zampoñas, charango y quena.',
  },
  {
    titulo: 'Taller de Tejido Andino',
    categoria: 'Cultura andina',
    lugar: 1,
    dias: 20,
    hora: 10,
    horas: 3,
    precio: 25,
    etiquetas: ['tejido', 'taller'],
    descripcion: 'Aprende técnicas básicas de tejido con hilos de colores.',
  },
  {
    titulo: 'Corrida Nocturna 5K de la Reserva',
    categoria: 'Deporte',
    lugar: 2,
    dias: 17,
    hora: 19,
    horas: 2,
    precio: 30,
    etiquetas: ['running', '5k'],
    descripcion: 'Carrera de 5 km entre las fuentes iluminadas.',
  },
  {
    titulo: 'Skate Jam en el Parque',
    categoria: 'Deporte',
    lugar: 4,
    dias: 27,
    hora: 15,
    horas: 4,
    precio: null,
    etiquetas: ['skate', 'gratis'],
    descripcion: 'Encuentro abierto de skate con retos para todos los niveles.',
  },
  {
    titulo: 'Yoga al Aire Libre en Barranco',
    categoria: 'Bienestar',
    lugar: 6,
    dias: 1,
    hora: 8,
    horas: 1,
    precio: 15,
    etiquetas: ['yoga', 'mañana'],
    descripcion: 'Clase de yoga frente al mar para empezar el día.',
  },
  {
    titulo: 'Meditación Guiada en el Museo',
    categoria: 'Bienestar',
    lugar: 1,
    dias: 23,
    hora: 9,
    horas: 1,
    precio: 10,
    etiquetas: ['meditación', 'calma'],
    descripcion: 'Una hora de meditación guiada entre salas de arte.',
  },
  {
    titulo: 'Festival Ficticio de Bandas Universitarias',
    categoria: 'Festivales',
    lugar: 2,
    dias: 28,
    hora: 14,
    horas: 8,
    precio: 40,
    etiquetas: ['festival', 'bandas'],
    descripcion: 'Bandas de universidades inventadas compiten por un premio simbólico.',
  },
  {
    titulo: 'Festival de Luces y Música del Centro',
    categoria: 'Festivales',
    lugar: 0,
    dias: 30,
    hora: 18,
    horas: 5,
    precio: null,
    etiquetas: ['festival', 'luces', 'gratis'],
    descripcion: 'Proyecciones de luz y música en vivo en el centro histórico.',
  },
  {
    titulo: 'Charla: Historia Secreta de Lima (Ficticia)',
    categoria: 'Cultura general',
    lugar: 5,
    dias: 26,
    hora: 19,
    horas: 2,
    precio: null,
    etiquetas: ['charla', 'historia', 'gratis'],
    descripcion: 'Una charla entretenida con leyendas limeñas inventadas.',
  },
  {
    titulo: 'Noche de Trivia Cultural',
    categoria: 'Cultura general',
    lugar: 5,
    dias: 29,
    hora: 19,
    horas: 2,
    precio: 10,
    etiquetas: ['trivia', 'amigos'],
    descripcion: 'Arma tu equipo y responde preguntas de cultura general.',
  },
];

// Lima está en UTC-5 todo el año
function fechaLima(dias: number, hora: number) {
  const hoyLima = new Date(Date.now() - 5 * 60 * 60 * 1000);
  return new Date(
    Date.UTC(
      hoyLima.getUTCFullYear(),
      hoyLima.getUTCMonth(),
      hoyLima.getUTCDate() + dias,
      hora + 5,
    ),
  );
}

async function crearAdmin() {
  const contrasenaHash = await bcrypt.hash(admin.contrasena, 10);
  await prisma.usuario.upsert({
    where: { correo: admin.correo },
    update: { contrasenaHash, rol: 'ADMIN' },
    create: { nombre: 'Administrador', correo: admin.correo, contrasenaHash, rol: 'ADMIN' },
  });
}

async function crearOrganizador(nombre: string, correo: string) {
  const existente = await prisma.usuario.findUnique({ where: { correo } });
  if (existente) return existente;

  const contrasena = ORGANIZADOR_PASSWORD || randomBytes(9).toString('base64url');
  const organizador = await prisma.usuario.create({
    data: { nombre, correo, contrasenaHash: await bcrypt.hash(contrasena, 10), rol: 'ORGANIZADOR' },
  });

  if (ORGANIZADOR_PASSWORD) {
    console.info(`Organizador creado: ${correo} (contraseña de ORGANIZADOR_PASSWORD)`);
  } else {
    console.info(
      `Organizador creado: ${correo} / contraseña: ${contrasena} (guárdala, no se vuelve a mostrar)`,
    );
  }
  return organizador;
}

async function main() {
  await crearAdmin();
  const organizadores = [
    await crearOrganizador('Colectivo Sonido Lima (prueba)', 'organizador1@runago.test'),
    await crearOrganizador('Cultura Viva Producciones (prueba)', 'organizador2@runago.test'),
  ];

  for (const nombre of categorias) {
    await prisma.categoria.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }

  const lugaresGuardados = [];
  for (const lugar of lugares) {
    const existente = await prisma.lugar.findFirst({ where: { nombre: lugar.nombre } });
    lugaresGuardados.push(
      existente
        ? await prisma.lugar.update({ where: { id: existente.id }, data: lugar })
        : await prisma.lugar.create({ data: lugar }),
    );
  }

  for (const [i, evento] of eventos.entries()) {
    const lugar = lugaresGuardados[evento.lugar];
    const categoria = await prisma.categoria.findUniqueOrThrow({
      where: { nombre: evento.categoria },
    });
    const fechaInicio = fechaLima(evento.dias, evento.hora);

    const data = {
      titulo: evento.titulo,
      descripcion: `${evento.descripcion} (Evento ficticio de ejemplo)`,
      etiquetas: evento.etiquetas,
      fechaInicio,
      fechaFin: new Date(fechaInicio.getTime() + evento.horas * 60 * 60 * 1000),
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      imagenUrl: null,
      precioReferencia: evento.precio,
      organizadorId: organizadores[i % 2].id,
      categoriaId: categoria.id,
      lugarId: lugar.id,
    };

    const existente = await prisma.evento.findFirst({ where: { titulo: evento.titulo } });
    if (existente) {
      await prisma.evento.update({ where: { id: existente.id }, data });
    } else {
      await prisma.evento.create({ data });
    }
  }

  const conteo = {
    usuarios: await prisma.usuario.count(),
    categorias: await prisma.categoria.count(),
    lugares: await prisma.lugar.count(),
    eventos: await prisma.evento.count(),
    favoritos: await prisma.favorito.count(),
    intereses_usuario: await prisma.interesUsuario.count(),
    membresias: await prisma.membresia.count(),
    resenas: await prisma.resena.count(),
    fotos: await prisma.foto.count(),
  };

  console.info('Seed terminado. Registros por tabla:');
  for (const [tabla, total] of Object.entries(conteo)) {
    console.info(`- ${tabla}: ${total}`);
  }
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
