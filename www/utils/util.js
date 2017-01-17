'use strict'; 

module.exports = {

  sparse: function(el){
    var sizeOfFather = el.offsetWidth;
    var totalElements = el.childElementCount;
    for(var index =0; index < totalElements; index++)
      el.children[index].setAttribute('style', 'width:' + sizeOfFather/totalElements +'px;')
  },

  msg: function(title, message, cb, btns){
    //msg
  },

  saveInDB: function(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
  },

  getFromDB: function(key){
    return JSON.parse(localStorage.getItem(key));
  },

  isCordovaEnable: function(){
    var cordova = !_.isUndefined(window.cordova);
    return function(){
      return cordova;
    }
  }();



}
