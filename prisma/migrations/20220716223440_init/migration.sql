-- CreateTable
CREATE TABLE "ProblemList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "solved" BOOLEAN DEFAULT false,

    CONSTRAINT "ProblemList_pkey" PRIMARY KEY ("id")
);
