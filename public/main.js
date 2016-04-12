var uploadFile = function (fileData, load) {
    var progress = 0;
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable && progress < 100) {
            progress = parseFloat((e.loaded / e.total * 100).toFixed(0));
            fileData.progress = progress;
        }
    });
    xhr.addEventListener('load', function (e) {
        var data = JSON.parse(e.currentTarget.response);
        progress = 100;
        fileData.progress = progress;
        load(data.data);
    });
    xhr.open('post', '/api/upload');
    var fd = new FormData;
    fd.append('photo', fileData.file);
    fd.append('size', fileData.size);
    fd.append('name', fileData.name);
    fd.append('type', fileData.type.replace('image/', ''));
    xhr.send(fd);
};

var addFile = function (vm, fileData) {
    var _URL = window.URL || window.webkitURL;
    var src = _URL.createObjectURL(fileData);
    var img = new Image();
    img.onload = function () {
        vm.uploadingPhotos.push({
            src: src,
            name: fileData.name.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/, ''),
            size: fileData.size,
            type: fileData.type,
            file: fileData,
            progress: 0
        });
    };
    img.onerror = function () {
        console.log(img, '添加图片出错，请重新添加')
    };
    img.src = src;

//                var reader = new FileReader();
//                reader.onload = function (e) {
//                    var src = e.target.result;
//                    vm.uploadingPhotos.push({
//                        src: src,
//                        name: fileData.name,
//                        size: fileData.size,
//                        file: fileData
//                    });
//                };
//                reader.readAsDataURL(file);
}