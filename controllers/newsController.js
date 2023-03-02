const asyncHandler = require("express-async-handler");
const ImageToBase64 = require("image-to-base64");
const News = require("../models/newsModel");
const decode = require('node-base64-image').decode
var path = require('path')
const fs = require('fs')

// @desc    Add News
// @route   POST /api/news/add-news
// @access  Public
const addNews = asyncHandler(async (req, res) => {
    try {
        const { title, content, author, category, addToSlider } = req.body;
        let path = (req.files.image.name.substring(0, req.files.image.name.length - 4) + Date.now()).replace(/\s/g, '');
        const extension = req.files.image.type === 'image/jpeg' ? '.jpg' : '.png'
        const base64Code = await ImageToBase64(req.files.image.path)
        await decode(base64Code, { fname: "./uploads/news/" + path, ext: req.files.image.type === 'image/jpeg' ? 'jpg' : 'png' })
        //-----------------------------------------------------------------------
        const image = `${process.env.Base_Url}/api/news/displayNewsImage?image=` + path + extension
        const news = await News.create({
            author,
            title,
            content,
            category,
            addToSlider,
            newsImage: image,
            addedAt: Date.now(),
        });
        if (news) {
            res.status(201).json({
                success: true,
                msg: "Successfully Added News",
                data: news,
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "Inavalid Data. Something Went Wrong Please Try Again Later !",
                error: "Record Not Added..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    displayNewsImage
// @route   Get  /api/news/displayNewsImage?image=imageName
// @access  Private
const displayNewsImage = asyncHandler(async (req, res) => {
    const file = path.join(__dirname.substring(0, __dirname.length - 12), `./uploads/news/${req.query.image}`)
    if (fs.existsSync(file)) {
        res.status(200).sendFile(path.join(__dirname.substring(0, __dirname.length - 12), `./uploads/news/${req.query.image}`));
    }
    else {
        res.status(200).sendFile(path.join(__dirname.substring(0, __dirname.length - 12), `./uploads/dummy/noImage.png`));
    }
})

// @desc    All News with pagination & Limit
// @route   Get /api/news/get-all-news
// @access  Public
const getAllNews = asyncHandler(async (req, res) => {
    try {
        const pageLimit = req.query.pageLimit;
        const pageNo = req.query.pageNo;
        let query = {};

        if (pageNo < 0 || pageNo === 0) {
            return res.status(401).json({
                success: false,
                msg: "Invalid page number",
                error: "Invalid page number, should start with 1",
            });
        }

        query.skip = pageLimit * (pageNo - 1);
        query.limit = pageLimit;

        const totalNewsCount = await News.find();
        const news = await News.find({})
            .sort("-addedAt")
            .populate({ path: "category", select: [("_id", "category_name")] })
            .limit(Number(query.limit))
            .skip(Number(query.skip));

        if (news) {
            res.status(201).json({
                success: true,
                msg: "News Found Successfully",
                count: news.length,
                totalCount: totalNewsCount.length,
                data: news,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    News By Id
// @route   Get /api/news/get-news-byId
// @access  Public
const getNewsById = asyncHandler(async (req, res) => {
    try {
        const news = await News.findById(req.query.id)
            .sort("-addedAt")
            .populate({
                path: "category",
                select: [("_id", "category_name")],
            });

        if (news) {
            res.status(201).json({
                success: true,
                msg: "News Found Successfully",
                data: news,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    Slider News
// @route   Get /api/news/get-slider-news
// @access  Public
const getSliderNews = asyncHandler(async (req, res) => {
    try {
        const news = await News.find({ addToSlider: true }).populate({
            path: "category",
            select: [("_id", "category_name")],
        });

        if (news) {
            res.status(201).json({
                success: true,
                msg: "News Found Successfully",
                data: news,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    News By Category Id
// @route   Get /api/news/get-news-category
// @access  Public
const getNewsByCategory = asyncHandler(async (req, res) => {
    try {
        const news = await News.find({ category: req.query.id }).populate({
            path: "category",
            select: [("_id", "category_name")],
        });

        if (news) {
            res.status(201).json({
                success: true,
                msg: "News Found Successfully",
                data: news,
                count: news.length,
                error: "No Error",
            });
        } else {
            return res.status(401).json({
                success: false,
                msg: "No News Found...",
                error: "Record Not Found..",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
});

// @desc    Update News
// @route   Update /api/news/update-news/id=....
// @access  Public 
const updateNews = asyncHandler(async (req, res) => {
    const { id } = req.query
    const { author, title, content, url } = req.body
    if (req.files?.image) {
        const updatedData = await News.findOne({ _id: id })
        console.log(updatedData)
        if (updatedData) {
            console.log("🚀 ~ file: newsController.js:360 ~ updateNews ~ updatedData.newsImage:", updatedData.newsImage)
            // For live Count base url value.
            // const imageFile = updatedData.newsImage.substring(69)
            const imageFile = updatedData.newsImage.substring(47)
            const folder = path.join(__dirname.substring(0, __dirname.length - 12), `./uploads/news/`)
            const path1 = (req.files.image.name.substring(0, req.files.image.name.length - 4) + Date.now()).replace(/\s/g, '')
            const extension = req.files.image.type === 'image/jpeg' ? '.jpg' : '.png'
            fs.unlink(folder + imageFile, (errr) => {
                if (errr) {
                    console.log("fileSystem Error: ", errr)
                }
                else {
                    console.log("image file deleted successfully")
                }
            });
            const image64 = await ImageToBase64(req.files.image.path)
            await decode(image64, { fname: "./uploads/news/" + path1, ext: req.files.image.type === 'image/jpeg' ? 'jpg' : 'png' })
            const image = `${process.env.Base_Url}/api/news/displayNewsImage?image=` + path1 + extension
            // const image = `https://dedicatedtestserver.com:8091/api/brand/displayimage?logo=` + path1 + extension
            const updateNewsData = await News.updateOne({ _id: id }, { $set: { author, title, content, url, newsImage: image } })
            if (updateNewsData.acknowledged) {
                res.status(200).json({
                    success: true,
                    msg: 'News updated successfully'
                });
            }
            else {
                res.status(200).json({
                    success: false,
                    msg: 'Something went wrong in server, plz try again',
                });
            }
        } else {
            res.status(200).json({
                success: false,
                msg: 'Something went wrong in server, plz try again'
            });
        }

    } else {
        console.log("this One")
        const updateNewsData = await Brand.updateOne({ _id: id }, { $set: { author, title, content, url, newsImage } })
        if (updateNewsData.acknowledged) {
            res.status(200).json({
                success: true,
                msg: 'News updated successfully'
            });
        }
        else {
            res.status(200).json({
                success: false,
                msg: 'Something went wrong in server, plz try again',
            });
        }
    }
})

// @desc    Delete News
// @route   Delete /api/news/delete-news/id=....
// @access  Public
const deleteNews = asyncHandler(async (req, res) => {
    const { id } = req.query
    try {
        const newsData = await News.findOne({ _id: id })
        if (newsData) {
            const deletedData = await News.deleteOne({ _id: id });
            if (deletedData.acknowledged) { 
                const imageFileName = newsData.newsImage.substring(47)
                const folder = path.join(__dirname.substring(0, __dirname.length - 12), `./uploads/news/`)
                fs.unlink(folder + imageFileName, (errr) => {
                    if (errr) {
                        console.log("fileSystem Error: ", errr)
                    }
                    else {
                        console.log("image file deleted successfully")
                    }
                });
                res.status(200).json({
                    success: false,
                    msg: "News Deleted Successfully !",
                    error: "no error",
                });
            } else {
                res.status(401).json({
                    success: false,
                    msg: "News Not deleted !",
                    error: "News Not deleted Please Try Again Later.",
                });
            }
        } else {
            res.status(200).json({
                success: false,
                msg: "news data not found !",
                error: "news data not found.",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error occured.",
            error: err,
        });
    }
})

module.exports = {
    addNews,
    getAllNews,
    getNewsById,
    getSliderNews,
    getNewsByCategory,
    deleteNews,
    updateNews,
    displayNewsImage
};