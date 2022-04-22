-- CreateTable
CREATE TABLE "duckduckgo" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "description" TEXT NOT NULL,
    "time" VARCHAR(255) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "image_url" VARCHAR(1000) NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "duckduckgo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "image_url" VARCHAR(1000) NOT NULL,
    "time" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "related_queries" TEXT NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "google_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "thumbnail_sm" VARCHAR(255) NOT NULL,
    "thumbnail_lg" VARCHAR(255) NOT NULL,
    "channel_name" VARCHAR(255) NOT NULL,
    "channel_thumbnail" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "youtube_pkey" PRIMARY KEY ("id")
);
