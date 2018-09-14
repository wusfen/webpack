 import _ from 'lodash';
 import './style.css'

 function component() {
    var element = document.createElement('div');
   var button = document.createElement('button');
   var br = document.createElement('br');

   button.innerHTML = 'Click me and look at the console!';
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.appendChild(br);
   element.appendChild(button);
   element.className = 'hello'

   button.onclick = function(){
    console.log('click2')
   }

    return element;
  }

 document.body.appendChild(component());