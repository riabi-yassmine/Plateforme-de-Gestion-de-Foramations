-- CreateTable
CREATE TABLE "Formateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "cv" TEXT NOT NULL,
    "specialites" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chargeHoraire" INTEGER NOT NULL,
    "programmePdf" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "categories" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "formationId" INTEGER NOT NULL,
    "dateDebut" TEXT NOT NULL,
    "dateFin" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Session_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "Candidat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FormateurSessions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FormateurSessions_A_fkey" FOREIGN KEY ("A") REFERENCES "Formateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FormateurSessions_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormateurSessions_AB_unique" ON "_FormateurSessions"("A", "B");

-- CreateIndex
CREATE INDEX "_FormateurSessions_B_index" ON "_FormateurSessions"("B");
