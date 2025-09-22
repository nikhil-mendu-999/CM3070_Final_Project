-- CreateTable
CREATE TABLE "public"."UserLinkedAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "profileUrl" TEXT,

    CONSTRAINT "UserLinkedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLinkedAccount_provider_providerId_key" ON "public"."UserLinkedAccount"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "public"."UserLinkedAccount" ADD CONSTRAINT "UserLinkedAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
