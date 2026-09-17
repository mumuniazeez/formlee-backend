-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);
