const router = require("express").Router();
const Images = require("../models/Image");

router.get('/:imgName', async (req, res) => {
    const filePath = await Images.findOne({
        imgName: req.params.imgName
    });
    // console.log(filePath.contentType);
    res.contentType(filePath.image.contentType);
    res.send(filePath.image.data);
});
module.exports = router;