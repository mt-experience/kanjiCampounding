window.addEventListener("load", function(){
  // 熟語を20個取ってくる
  const jukugos = randomArray(fullJukugo, 20)
  const flist = document.querySelector('#free-list') 
  
  // todo 文字にばらす
  
  // 熟語ボタンをfree-listに配置 <= 文字にばらさなきゃ
  jukugos.map(i => appendButton(flist, i))
  
}, false)

// fullArrから無作為にnum個選択したサブセットを返す。
function randomArray(fullArr, num){
  const seq = [...Array(fullArr.length).keys()]
  let arr = []
  for(i=0; i < num; i++){
	iSeq = Math.floor(Math.random() * seq.length)
    arr.push(fullArr[seq[iSeq]])
	seq.splice(iSeq, 1)  // sequenseからは削除
  }
  return arr
}



// textをinnerTextにしたbuttonを作成、parentに加える。
// ちなみにボタンの移動は、Y-div.appendChild(Xのボタン)とすれば可能。
function appendButton(parent, text){
  let btn = document.createElement('button')
  btn.innerText = text
  parent.appendChild(btn)
}