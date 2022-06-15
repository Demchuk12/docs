import React from 'react'

export default function buttonsGroup() {
  if(localStorage.getItem("accsses_token")){
    return (
        <div>buttonsGroup</div>
      )
  }else{
    <div>buttonsGroup</div>
  }
  
}
