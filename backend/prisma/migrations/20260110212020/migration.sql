/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Formateur` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Formateur_email_key" ON "Formateur"("email");
