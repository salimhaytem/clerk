-- CreateTable
CREATE TABLE "contact_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_views_userId_viewedAt_idx" ON "contact_views"("userId", "viewedAt");

-- AddForeignKey
ALTER TABLE "contact_views" ADD CONSTRAINT "contact_views_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
