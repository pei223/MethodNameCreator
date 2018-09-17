import React from 'react';

const MAX_OPACITY = 0.7

export default class CopiedFrame extends React.Component {
  constructor(props) {
    super(props)

    this.modalIntervalTime = null
    this.modalWillShow = this.modalWillShow.bind(this)
    this.modalWillHide = this.modalWillHide.bind(this)
    this.state = {
      opacity: 0.
    }
  }

  /**
   * modalが閉・開くとき、opacityが変化したとき、状態変化させる
   */
  shouldComponentUpdate(nextProps, nextState) {
    // 【更新】modalの表示状態が更新されたとき
    if(this.props.isModalStateChanged != nextProps.isModalStateChanged) {
      this.modalWillShow()
      return true
    }
    // 【更新】完全にmodalが表示されたとき
    else if(MAX_OPACITY < nextState.opacity) {
      clearInterval(this.modalIntervalTime)
      // modalを閉じる
      this.modalWillHide()
      return false
    }
    // 【更新】 完全にmodalが閉じたとき
    else if (0.0 > nextState.opacity) {
      clearInterval(this.modalIntervalTime)
      this.modalIntervalTime = null
      this.setState({
        opacity: 0.0
      })
      return false
    }
    // 【更新】opacityが変化した場合
    else if(nextState.opacity != this.state.opacity) {
      return true
    }

    return false
  }

  /**
   * modalを表示させる
   */
  modalWillShow() {
    // 完全にmodalが閉じたときのみ発動する, 排他処理
    if(null === this.modalIntervalTime) {
      this.modalIntervalTime = setInterval(() => {
        let opacity = this.state.opacity + 0.2
        this.setState({
          opacity: opacity
        })
      }, 40)
    }
  }

  /**
   * modalを隠す
   */
  modalWillHide() {
    this.modalIntervalTime = setInterval(() => {
      let opacity = this.state.opacity - 0.2
      this.setState({
        opacity: opacity
      })
    }, 40)
  }

  /**
   * レンダー
   */
  render() {
    // opacityが0の時は何も表示させない
    if(0.0 === this.state.opacity) {
      return (
        null
      )
    }

    return(
      <div 
      className={this.props.className} 
      style={{opacity: this.state.opacity}}>
        {this.props.children}
      </div>
    )
  }
}