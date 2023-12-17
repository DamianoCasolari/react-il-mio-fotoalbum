const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listaCategorie = [
  {
    name: "Web Development",
    description: "Articles related to web development.",
  },
  {
    name: "Mobile App Development",
    description: "Articles related to mobile app development.",
  },
  {
    name: "Data Science",
    description: "Articles related to data science and analytics.",
  },
  {
    name: "UI/UX Design",
    description: "Articles related to user interface and user experience design.",
  },
  {
    name: "Cloud Computing",
    description: "Articles related to cloud computing technologies.",
  },
];

prisma.category.createMany({
  data: listaCategorie,
  skipDuplicates: true,
}).then(result => console.log(result));

prisma.tag.createMany({
  data: listaTag,
  skipDuplicates: true,
}).then(result => console.log(result));