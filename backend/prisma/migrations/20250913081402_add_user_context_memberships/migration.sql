-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Context" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileContext" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "contextId" INTEGER NOT NULL,
    "displayName" TEXT,
    "visibility" TEXT NOT NULL,

    CONSTRAINT "ProfileContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserContext" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "contextId" INTEGER NOT NULL,

    CONSTRAINT "UserContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Context_name_key" ON "public"."Context"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileContext_profileId_contextId_key" ON "public"."ProfileContext"("profileId", "contextId");

-- CreateIndex
CREATE UNIQUE INDEX "UserContext_userId_contextId_key" ON "public"."UserContext"("userId", "contextId");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileContext" ADD CONSTRAINT "ProfileContext_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileContext" ADD CONSTRAINT "ProfileContext_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "public"."Context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserContext" ADD CONSTRAINT "UserContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserContext" ADD CONSTRAINT "UserContext_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "public"."Context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
