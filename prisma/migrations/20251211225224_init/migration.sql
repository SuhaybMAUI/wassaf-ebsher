-- CreateTable
CREATE TABLE "Description" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "originalDesc" TEXT NOT NULL,
    "reformulatedDesc" TEXT NOT NULL,
    "manualEdit" TEXT,
    "wasEdited" BOOLEAN NOT NULL DEFAULT false,
    "usedForTraining" BOOLEAN NOT NULL DEFAULT false,
    "apiUsed" TEXT NOT NULL DEFAULT 'gemini',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditLog" (
    "id" TEXT NOT NULL,
    "descriptionId" TEXT NOT NULL,
    "beforeText" TEXT NOT NULL,
    "afterText" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingStats" (
    "id" TEXT NOT NULL,
    "totalTrainings" INTEGER NOT NULL DEFAULT 0,
    "lastTrainedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSettings" (
    "id" TEXT NOT NULL,
    "geminiKey" TEXT,
    "claudeKey" TEXT,
    "primaryApi" TEXT NOT NULL DEFAULT 'gemini',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Description_createdAt_idx" ON "Description"("createdAt");

-- CreateIndex
CREATE INDEX "Description_usedForTraining_idx" ON "Description"("usedForTraining");

-- CreateIndex
CREATE INDEX "EditLog_descriptionId_idx" ON "EditLog"("descriptionId");

-- CreateIndex
CREATE INDEX "EditLog_editedAt_idx" ON "EditLog"("editedAt");

-- AddForeignKey
ALTER TABLE "EditLog" ADD CONSTRAINT "EditLog_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Description"("id") ON DELETE CASCADE ON UPDATE CASCADE;
