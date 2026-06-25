// ============================================================
// config/prisma.js — Instancia compartida de Prisma Client
// ------------------------------------------------------------
// Exportamos UNA sola instancia de PrismaClient para todo el
// proyecto. Esto es importante porque cada instancia abre su
// propio pool de conexiones a la base de datos. Si cada módulo
// creara su propia instancia, agotaríamos las conexiones
// disponibles de PostgreSQL rápidamente.
//
// Patrón: Singleton — una sola instancia compartida globalmente
// ============================================================

const { PrismaClient } = require('../../generated/prisma');
const { PrismaPg }     = require('@prisma/adapter-pg');

// PrismaPg es el adaptador nativo de PostgreSQL para Prisma 11.
// Recibe la URL de conexión desde las variables de entorno (.env).
// Formato: postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Creamos el cliente pasándole el adaptador nativo.
// Este cliente expone todos los modelos del schema como propiedades:
// prisma.user, prisma.vehicle, prisma.reservation, etc.
const prisma = new PrismaClient({ adapter });

module.exports = prisma;