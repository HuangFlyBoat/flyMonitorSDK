import './App.css';
import { NavLink } from 'react-router-dom';
import { trackSend } from '../../../src/main/index';

function App() {
  setTimeout(() => {
    // FMP 指标测试
    let content = document.getElementsByClassName('content')[0];
    let h1 = document.createElement('h1');
    h1.innerHTML = '我是这个页面中最有意义的元素';
    h1.setAttribute('elementtiming', 'meaningful');
    content.appendChild(h1);
  }, 2000);

  function errorClick() {
    window.someVar.error = 'error';
  }
  function promiseErrorClick() {
    new Promise(function (resolve, reject) {
      window.someVar.error = 'error';
    });
  }
  function resourceErrorClick() {
    let img = document.createElement('img');
    img.src = 'https://testRes.com/test.jpg';
    document.body.appendChild(img);
  }
  function interfaceErrorClick(isSuccess = false) {
    let xhr = new XMLHttpRequest();
    let url = isSuccess ? '/api/users' : '/api/error';
    if (isSuccess) {
      xhr.open('GET', url, true);
      xhr.send();
    } else {
      let data = {
        name: 'Alice',
        age: 25,
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }
  function fetchErrorClick(isSuccess = false) {
    let url = isSuccess ? '/api/users' : '/api/error';
    if (isSuccess) {
      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      }).then(res => {
        console.log('res', res);
      });
    } else {
      let data = {
        name: 'Alice',
        age: 25,
      };
      fetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
        body: JSON.stringify(data),
      }).then((_, rej) => {
        console.log('rej', rej);
      });
    }
  }

  return (
    <>
      <h2>错误监控，点击按钮进行模拟前端报错情况</h2>
      <div className='card'>
        <div className='content'>
          <div className='box-card'>
            <input type='button' value='点击抛出错误' onClick={errorClick} />
            <input
              id='custom'
              type='button'
              value='自定义上报事件'
              onClick={() => {
                trackSend({
                  kind: 'custom',
                });
              }}
            />
          </div>
          <div className='box-card'>
            <input type='button' value='点击抛出Promise错误' onClick={promiseErrorClick} />
            <input type='button' value='点击抛出资源加载错误' onClick={resourceErrorClick} />
          </div>
          <div className='box-card'>
            <p>xhr</p>
            <input type='button' value='调用接口(成功)' onClick={() => interfaceErrorClick(true)} />
            <input type='button' value='调用接口(失败)' onClick={() => interfaceErrorClick(false)} />
          </div>
          <div className='box-card'>
            <p>fetch</p>
            <input type='button' value='调用接口(成功)' onClick={() => fetchErrorClick(true)} />
            <input type='button' value='调用接口(失败)' onClick={() => fetchErrorClick(false)} />
          </div>
        </div>
      </div>
      <p className='read-the-docs'>点击切换路由</p>
      <NavLink to='/about'>About</NavLink>
    </>
  );
}

export default App;
