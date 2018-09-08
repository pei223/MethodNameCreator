import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import logo from './logo.svg'
import SearchBox from './SearchBox'
import './App.css'

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  /**
   * 英語テキストをクリップボードにコピーする
   */
  copyEnText(){
    let enTextElem = document.getElementById("enText")
    let enText = enTextElem.value
    // クリップボードにコピー
    var ta = document.createElement("input")
    ta.value = enText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.parentElement.removeChild(ta)
    enTextElem.focus()
  }

  setEnText(enText) {
    document.getElementById("enText").value = enText
  }

  render() {
    // TODO BootStrapでデバイス毎にレスポンシブにする
    return (
        <div>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Method Name Creator</h1>
              <h2 className="App-title">メソッド・変数名を日本語から変換します</h2>
            </header>
          </div>
          <div className="container app-container col-md-offset-3 col-md-6">
            <SearchBox setEnText={this.setEnText.bind(this)} />
            <p className="arrow-box">
              <span className="arrow">∨</span>
            </p>
            
            <div className="row">
              <input id="enText" type="text" placeholder="英語の関数・変数名" className="form-control" onKeyUp={this.copyEnText}/>
            </div>
          </div>
        </div>
    )
  }
}