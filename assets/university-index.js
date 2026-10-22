(function(){
 'use strict';
 const input=document.getElementById('university-query');
 const cards=[...document.querySelectorAll('.university-card')];
 input.addEventListener('input',()=>{
  const q=input.value.replace(/\s/g,'').toLowerCase();
  let count=0;
  cards.forEach(card=>{const show=!q||card.textContent.replace(/\s/g,'').toLowerCase().includes(q);card.hidden=!show;if(show)count++;});
  document.getElementById('university-status').textContent=count+' / 29개 대학';
  document.getElementById('university-empty').hidden=count!==0;
 });
})();

