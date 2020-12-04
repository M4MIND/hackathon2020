import querystring from "querystring";
import PhotoPicker from "../../libs/photoPicker/photo-picker";
import path from "path";

module.exports = async (req, res) => {
  console.log({ team: req.query.team, cwd: process.cwd(), req: req.query });

  const photoDir = path.resolve(
    process.cwd(),
    "public",
    "banners",
    "vacancy",
    req.query.team
  );

  console.log(photoDir);
  const photoPicker = new PhotoPicker(`${photoDir}/*.png`);

  const photo = await photoPicker.pick(querystring.stringify(req.query));

  res.json({
    photo: photo,
  });
};
