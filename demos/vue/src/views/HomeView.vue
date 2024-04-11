<template>
  <main>
    <div id="container">
      <h1>错误监控，点击按钮进行模拟前端报错情况</h1>
      <div class="content">
        <div class="box-card">
          <input type="button" value="点击抛出错误" @click="errorClick" />
          <input id="custom" type="button" value="自定义上报事件" />
        </div>
        <div class="box-card">
          <input type="button" value="点击抛出Promise错误" @click="promiseErrorClick" />
          <input type="button" value="点击抛出资源加载错误" @click="resourceErrorClick" />
        </div>
        <div class="box-card">
          <p>xhr</p>
          <input type="button" value="调用接口(成功)" @click="interfaceErrorClick(true)" />
          <input type="button" value="调用接口(失败)" @click="interfaceErrorClick(false)" />
        </div>
        <div class="box-card">
          <p>fetch</p>
          <input type="button" value="调用接口(成功)" @click="fetchErrorClick(true)" />
          <input type="button" value="调用接口(失败)" @click="fetchErrorClick(false)" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
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
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content .box-card {
  padding: 10px 0;
}
</style>
