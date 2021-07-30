import React, { useState } from 'react';
import opentype from 'opentype.js';
import { copyToClipboard } from '@/js/util';
import { message } from 'antd';
import style from './index.less';

export default function Tool2() {
  const [iconList, setIconList] = useState([]);

  function onChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader(file);
      reader.readAsArrayBuffer(file);
      reader.onload = function (evt) {
        parseIcon(evt.target.result);
      };

      // base64 编码，动态加入 @font-face
      let readerBase64 = new FileReader();
      readerBase64.readAsDataURL(file);
      readerBase64.onload = (evt) => {
        setStyle(evt.target.result);
      };
    }
  }

  function parseIcon(bufferStr) {
    const result = opentype.parse(bufferStr);
    const icons = [];

    for (let key in result.glyphs.glyphs) {
      const item = result.glyphs.glyphs[key];

      if (item.unicode) {
        icons.push({
          name: parseInt(item.unicode).toString(16),
          value: `&#x${parseInt(item.unicode).toString(16)};`,
        });
      }
    }
    // icons.forEach((item) => {
    //   item.value = item.value.replace(/&#([^;]+);/gi, (target, value) => {
    //     return `&#x${parseInt(value).toString(16)};`;
    //   });
    // });
    // console.log(icons);
    setIconList(icons);
  }

  function setStyle(bufferStr) {
    let $style = document.createElement('style');

    $style.innerHTML = `
      @font-face {
      font-family: 'iconfont';
      src: url('${bufferStr}') format('truetype');
      }
      .${style.iconfont} {
      font-family: "iconfont" !important;
      font-size: 24px;font-style: normal;
      -webkit-font-smoothing: antialiased;
      -webkit-text-stroke-width: 0.2px;
      -moz-osx-font-smoothing: grayscale;
      }`;

    document.body.append($style);
  }

  return (
    <div className={style.wrap}>
      <h1>本地ttf、woff、otf预览页</h1>
      <input type="file" onChange={onChange} accept=".ttf,.woff,.otf" />
      {iconList.length > 0 && <div className={style.tips}>点击复制unicode编码</div>}
      <div className={style.iconWrap}>
        {iconList.map((v, i) => (
          <div
            key={i}
            className={style.iconBox}
            onClick={() => {
              copyToClipboard(v.name, () => {
                message.success('已复制：' + v.name);
              });
            }}
          >
            <p
              className={style.iconfont}
              dangerouslySetInnerHTML={{ __html: v.value }}
            ></p>
            <div className={style.iconName}>{v.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
