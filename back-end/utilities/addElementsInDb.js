const { PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient()

const photoList = [
  {
    id: 1,
    title: "First photo",
    slug: "first-photo",
    image: "image_url",
    description: "Description of the first photo.",
    visible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Second photo",
    slug: "second-photo",
    image: "image_url",
    description: "Description of the second photo.",
    visible: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Third photo",
    slug: "third-photo",
    image: "image_url",
    description: "Description of the third photo.",
    visible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Fourth photo",
    slug: "fourth-photo",
    image: "image_url",
    description: "Description of the fourth photo.",
    visible: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

];


  prisma.photo.createMany({
    data:photosList,
    skipDuplicates: true
}).then(result => console.log(result))