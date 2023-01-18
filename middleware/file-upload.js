const multer=require('multer')
const fs=require('fs')
const path=require('path')

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        let fileDestination='public/uploads'
        // check if directory exists 
        if(!fs.existsSync(fileDestination)){
        fs.mkdirSync(fileDestination,{recursive:true})
        // parent as well as sub folter =recursive
        callback(null,fileDestination)
    }
    else{
        callback(null,fileDestination)
    }
},
filename:(req,file,cb)=>{
let filename=path.basename(file.originalname,path.extname(file.originalname))
// path.basename(a.jpg,.jpg)
// a
let ext=path.extname(file.originalname)
// .jpg 
cb(null,filename+'_'+Date.now()+ext)
// a_012345.jpg 
}
})

let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|svg|gif|jpeg|jfif|JPG|PNG|SVG|GIF|FPEG|JFIF)$/)){
        return cb(new Error('You can upload image file only'),false)

    }
    else{
        cb(null,true)
    }
}

const upload=multer({
    storage:storage,
    fileFilter:imageFilter,
    limits:{
        fileSize:6000000
        // 6000000=6MB 
    }

})
module.exports=upload
