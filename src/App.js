import React, { Component } from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import config from "./config.json"
import './App.css';
const Axios = require('axios');

class App extends Component {
  changeEnText (){
    let enTextElem = document.getElementById("enText")
    let enText = enTextElem.value
    // クリップボードにコピー
    var ta = document.createElement("textarea")
    ta.value = enText
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.parentElement.removeChild(ta)
    enTextElem.focus()
  }

  transName (){
    let jaText = document.getElementById("jaText").value
    if (jaText.length >= config.ja_text_name_len) {
      alert("名前は" + config.ja_text_name_len + "文字以内にしてください")
      return
    }
  }

  render() {
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
            <form>
              <div className="row">
                <input id="jaText" type="text" placeholder="日本語の処理・単語名" className="form-control"/>
              </div>
              <div className="row form-group case-view">
                <select name="caseSelect" class="form-control col-md-3" id="caseSelect">
                  <option value="camel">キャメルケース</option>
                  <option value="snake">スネークケース</option>
                  <option value="kebab">ケバブケース</option>
                </select>
              </div>
              <div className="row form-group">
                <button type="button" className="form-control btn btn-primary" onClick={this.transName}>変換</button>
              </div>
              <span className="arrow">∨</span>
              <div className="row">
                <input id="enText" type="text" placeholder="英語の関数・変数名" className="form-control" onKeyUp={this.changeEnText}/>
              </div>
            </form>
          </div>
        </div>
    );
  }
}

export default App;
