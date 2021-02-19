import bodyParser from 'body-parser';
const urlencodedParser = bodyParser.urlencoded({extended: false}) //включение парсера
import {verifyAccessToken} from './services/jwt_helper.js';


import {getFolders, createFolder, updateFolder, deleteFolder} from './controllers/foldersController.js'
import {getItems, createItem, updateItem, deleteItem, getItemsInTrash, getItemsInGivings} from './controllers/itemsController.js'
import {getUserCommunities, createUserCommunity, addUserToCommunity, deleteUserCommunity} from './controllers/userCommunitiesController.js'
import {getCommunity, createCommunity, getCommunityUsers, updateCommunity, deleteCommunity} from './controllers/communitiesController.js'

import {createGiving, deleteGiving} from './controllers/givingsController.js'
import {getStorages, createStorage, updateStorage, deleteStorage} from './controllers/storagesController.js'
import {updateSelectedCommunity, getUser} from './controllers/usersController.js'

import multer from 'multer'
import { deletePreviewImage, previewUploadImage } from './services/previewUploadImage.js';
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const upload = multer({storage: storage})


export default (app)=>{
    app.use(verifyAccessToken)
    app.get('/', (req, res)=>{
        res.send('hi')
    })


    // ------Folders-------
    app.get('/api/folders', urlencodedParser, getFolders)
    app.post('/api/folders', urlencodedParser, createFolder)
    app.put('/api/folders', urlencodedParser, updateFolder)
    app.delete('/api/folders', urlencodedParser, deleteFolder)

    // ------Storage-------
    app.get('/api/storages', urlencodedParser, getStorages) 
    app.post('/api/storages', urlencodedParser, createStorage)
    app.put('/api/storages', urlencodedParser, updateStorage)
    app.delete('/api/storages', urlencodedParser, deleteStorage)

    // ------Itmes-------
    app.get('/api/items', urlencodedParser, getItems)
    app.get('/api/items/trash', urlencodedParser, getItemsInTrash)
    app.get('/api/items/given', urlencodedParser, getItemsInGivings)
    app.post('/api/items', upload.single('image'), createItem)
    // app.post('/api/items', urlencodedParser, upload.single('image'), createItem)
    app.put('/api/items', upload.single('image'), updateItem)
    app.delete('/api/items', urlencodedParser, deleteItem)

    app.post('/api/previewUploadImage', upload.single('image'), previewUploadImage)
    app.delete('/api/previewUploadImage', urlencodedParser, deletePreviewImage)

    // ------Givings-------
    app.post('/api/givings', urlencodedParser, createGiving) // new
    app.delete('/api/givings', urlencodedParser, deleteGiving) // new

    // ------Users-------
    app.get('/api/users', urlencodedParser, getUser)
    app.put('/api/users', urlencodedParser, updateSelectedCommunity)

    // ------Communities-------
    app.get('/api/community', urlencodedParser, getCommunity)
    app.get('/api/communityUsers', urlencodedParser, getCommunityUsers) // new
    app.post('/api/community', urlencodedParser, createCommunity)
    app.put('/api/communities', urlencodedParser, updateCommunity) // new
    app.delete('/api/community', urlencodedParser, deleteCommunity) // new

    // ------UserCommunities-------
    app.get('/api/userCommunities', urlencodedParser, getUserCommunities)
    app.post('/api/userCommunities', urlencodedParser, createUserCommunity)
    app.post('/api/addUserToCommunity', urlencodedParser, addUserToCommunity)
    app.delete('/api/userCommunities', urlencodedParser, deleteUserCommunity)
}