const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { kebabCase } = require("lodash");
const notFound = require("../utilities/notFoundErrors");
const customError = require("../utilities/customErrors");

async function index(req, res, next) {
  const filters = req.query.filters;
  const queryFilter = {};
  const numberOfElementPerPage = 30;
  const currentPage = req.query.currentPage || 1;

  if (filters && filters.title) {
    queryFilter.title = {
      contains: filters.title,
    };
  }
  if (filters && filters.slug) {
    queryFilter.slug = {
      contains: filters.slug,
    };
  }

  try {
    const numberAllPosts = await prisma.photo.count({ where: queryFilter });
    const data = await prisma.photo.findMany({
      skip: (currentPage - 1) * numberOfElementPerPage,
      take: numberOfElementPerPage,
      where: queryFilter,
      include: {
        categories : true,
      },
    });
    if (data.length == 0) {
      next(new Error("Nessun Risultao"));
    }

    return res.json({ data, currentPage, numberAllPosts });
  } catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
    next(new Error("Errore interno del server"));
  }
}

async function show(req, res, next) {
  let slug = req.params.slug;
  try {
    const data = await prisma.photo.findFirst({
      where: {
        slug: slug,
      },
      include: {
        categories: true
      },
    });

    if (!data) {
      next(new customError("Il post inserito non risulta registrato", 404));
    }

    return res.json(data);
  } catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
    next(new Error("Errore interno del server :" + error.message));
  }
}

async function create(req, res, next) {
  const reqBody = req.body;
  reqBody.slug = kebabCase(reqBody.title);
  const imagePath = reqBody.image ?? "defaultPlaceHolder.jpg";

  if (!reqBody.title || !reqBody.content) {
    next(new Error(" Title and content are required"));
  }

  if (reqBody.title && reqBody.title.trim() == "") {
    next(new notFound("Title is required "));
  }
  if (reqBody.image && reqBody.image.trim() == "") {
    next(new notFound("Image is required "));
  }
  if (reqBody.content && reqBody.content.trim() == "") {
    next(new notFound("content is required "));
  }

  try {
    const existingPost = await prisma.photo.findFirst({
      where: {
        title: reqBody.title,
      },
    });

    if (existingPost) {
      reqBody.slug = reqBody.slug + `-${Date.now()}`;
    }

    const data = await prisma.photo.create({
      data: {
        title: reqBody.title,
        slug: reqBody.slug,
        image: imagePath,
        content: reqBody.content,
        published: reqBody.published,
        categories: {
          // si aspetta come valore un array di oggetti con la chiave id
          // [{id: 1}, {id: 2}, ....]
          connect: reqBody.categories.map((categoriesId) => ({
            id: parseInt(categoriesId),
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    return res.json(data);
  } catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
    next(new Error("Errore interno del server"));
  }
}

async function edit(req, res, next) {
  const reqBody = req.body;
  let newSlug;

  if (reqBody.title && reqBody.title.trim() == "") {
    next(new customError("Title is required ", 400));
  }
  if (reqBody.image && reqBody.image.trim() == "") {
    next(new customError("Image is required ", 400));
  }
  if (reqBody.content && reqBody.content.trim() == "") {
    next(new customError("Content is required ", 400));
  }

  if (reqBody.title) {
    newSlug = kebabCase(reqBody.title);
  }
  try {
    const existingPost = await prisma.photo.findFirst({
      where: {
        title: reqBody.title,
        NOT: {
          slug: req.params.slug,
        },
      },
    });

    if (existingPost) {
      newSlug = `${newSlug}-${existingPost.id}`;
    }

    const data = await prisma.photo.updateMany({
      where: {
        slug: req.params.slug,
      },
      data: {
        title: reqBody.title,
        slug: newSlug ?? undefined,
        image: reqBody.image,
        content: reqBody.content,
        published: reqBody.published,
        categoryId: parseInt(reqBody.categoryId),
      },
    });
    console.log(data);
    if (!Array.isArray(data) || data.length == undefined) {
      next(new customError("Il post inserito non risulta registrato", 404));
      return;
    }

    const updatedPost = await prisma.photo.findUnique({
      where: {
        slug: newSlug || req.params.slug,
      },
    });

    return res.json(updatedPost);
  } catch (error) {
    console.error(" Errore durante l'elaborazione della richiesta:", error);
    next(new Error("Errore interno del server"));
  }
}

async function destroy(req, res) {
  let slug = req.params.slug;
  try {
    await prisma.photo.delete({
      where: {
        slug: slug,
      },
    });
    return res.json("File eliminato con successo");
  } catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
    next(new Error("Errore interno del server"));
  }
}

module.exports = {
  index,
  create,
  show,
  edit,
  destroy,
};
