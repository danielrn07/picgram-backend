const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Create a photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user.id,
    userName: user.name,
  });

  // If photo was created successfully, return data
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Ocorreu um erro. Tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

// Remove a photo
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      res.status(404).json({
        errors: ["Foto não encontrada."],
      });
      return;
    }

    // Check if photo belongs to user
    if (!photo.userId === reqUser._id) {
      res.status(422).json({
        errors: [
          "Este usuário não tem permissão para apagar a foto selecionada.",
        ],
      });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res.status(200).json({
      id: photo._id,
      message: "Foto excluída.",
    });
  } catch (error) {
    res.status(404).json({
      errors: ["Ocorreu um erro. Tente novamente mais tarde."],
    });
    return;
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

// Get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

// Get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!ObjectId.isValid(id) || id.length !== 24) {
    res.status(400).json({
      errors: ["ID inválido."],
    });
    return;
  }

  try {
    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      res.status(404).json({
        errors: ["Foto não encontrada."],
      });
      return;
    }

    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({
      errors: ["Ocorreu um erro. Tente novamente mais tarde."],
    });
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
};
