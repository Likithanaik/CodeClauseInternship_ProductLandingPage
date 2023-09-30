// about me

var tablinks =document.getElementsByClassName("tablink");
    var tabcontents =document.getElementsByClassName("tabcontent");
    function opentab(tabname){
for(tablink of tablinks){
    tablink.classList.remove("activelink");
}
for(tabcontent of tabcontents){
    tabcontent.classList.remove("acttab");
}
event.currentTarget.classList.add("activelink");
document.getElementById(tabname).classList.add("acttab");}

// contact me
const scriptURL ='https://script.google.com/macros/s/AKfycbw4hcXqEI8Vfv-OfCeaJYKTH7iMCtFNkZz2qZf8oTkibDIFqr_8DHWC-Wp_MmELJL0b4A/exec'
const form = document.forms['submit-to-google-sheet']
const msg =document.getElementById("msg")
form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        msg.innerHTML="Message sent successfully"
        setTimeout(function(){
msg.innerHTML="" 
        },5000)
        form.reset()
    })
    .catch(error => console.error('Error!', error.message))
   
})