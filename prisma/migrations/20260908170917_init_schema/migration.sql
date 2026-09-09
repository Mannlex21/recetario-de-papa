-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receta" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "instrucciones" TEXT NOT NULL,
    "tiempoPreparacionInt" INTEGER NOT NULL,
    "porciones" INTEGER NOT NULL DEFAULT 1,
    "imagenUrl" TEXT,
    "categoria" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredienteReceta" (
    "id" TEXT NOT NULL,
    "recetaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" TEXT NOT NULL,

    CONSTRAINT "IngredienteReceta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuSemanal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "semana" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuSemanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemMenuSemanal" (
    "id" TEXT NOT NULL,
    "menuSemanalId" TEXT NOT NULL,
    "recetaId" TEXT NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "tipoComida" TEXT NOT NULL,

    CONSTRAINT "ItemMenuSemanal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Receta_slug_key" ON "Receta"("slug");

-- AddForeignKey
ALTER TABLE "Receta" ADD CONSTRAINT "Receta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredienteReceta" ADD CONSTRAINT "IngredienteReceta_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuSemanal" ADD CONSTRAINT "MenuSemanal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMenuSemanal" ADD CONSTRAINT "ItemMenuSemanal_menuSemanalId_fkey" FOREIGN KEY ("menuSemanalId") REFERENCES "MenuSemanal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemMenuSemanal" ADD CONSTRAINT "ItemMenuSemanal_recetaId_fkey" FOREIGN KEY ("recetaId") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
