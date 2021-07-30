import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.less';

export default function NotFound() {
  return (
    <div className={style.wrap}>
      <div className={style.icon}>p(´⌒｀｡q)</div>
      <div className={style.item}>
        <Link to="/tool">生成svg镜像文件页</Link>
      </div>
      <div className={style.item}>
        <Link to="/preview-font">本地ttf文件预览页</Link>
      </div>
    </div>
  );
}
