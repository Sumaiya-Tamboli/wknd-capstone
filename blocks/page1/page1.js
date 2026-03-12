document.querySelectorAll(".page1.block > div").forEach(card => {

  const link = card.querySelector("a");

  if(link){
    card.style.cursor="pointer";

    card.addEventListener("click", ()=>{
      window.location = link.href;
    });
  }

});