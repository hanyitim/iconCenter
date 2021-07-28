export const placeholderData = (data,approximate,concatArr=[])=>{
    data = data.concat(concatArr);
    let placeholderCount = approximate - data.length%approximate;
    for(let i = 0;i<placeholderCount;i++){
        data.push('placeholder');
    }
    return data;
};

export const getFilePath = (fileList) =>{
    return fileList.map((file)=>{
        if(file.response && file.response.data){
            return file.response.data.path;
        }
    });
};

export const download = (content,filename) => {
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('href', content);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

export const iconFormat = (icons)=>{
    return icons.map((item)=>{
        return {
            ...item,
            content:String.fromCharCode(item.code),
            unicode:item.code ? (item.code).toString(16) : ''
        };
    });
};

export function throttle() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    var timer = null,
        isLock = false;
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
  
      if (!isLock) {
        isLock = true;
        clearTimeout(timer);
        fn && fn.call && fn.apply(null, args);
        timer = setTimeout(function () {
          isLock = false;
        }, wait);
      }
    };
}

function isType(arg,type){
    return `${Object.prototype.toString.call(arg)}`.slice(8,-1).toLocaleLowerCase() === `${type}`.toLocaleLowerCase();
}

export const isString = (arg) => isType(arg,'string');
export const isArray = (arg) => isType(arg,'array');
export const isFunction = (arg) => isType(arg,'function');

export function copyToClipboard(text, cb) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
            cb && cb();
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    } else {
      const dummyElement = document.createElement('span');
      dummyElement.style.whiteSpace = 'pre';
      dummyElement.textContent = text;
      document.body.appendChild(dummyElement);

      const selection = window.getSelection();
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNode(dummyElement);
      selection.addRange(range);

      const isSuccess = document.execCommand('copy');

      if(isSuccess) {
        cb && cb();
      }

      selection.removeAllRanges();
      document.body.removeChild(dummyElement);
    }
  }