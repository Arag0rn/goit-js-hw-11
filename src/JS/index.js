import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";
import { Loading } from 'notiflix/build/notiflix-loading-aio'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import { createMarkup } from "./modules/galery.markup";
import { fetchImages } from "./modules/fetch";

const form = document.querySelector("#search-form");
const imagesContainer = document.querySelector(".gallery");
const upButton = document.querySelector(".upButton");
const guardJs = document.querySelector(".for_upButton")

form.addEventListener("submit", onFormSubmit);
const simpleLightbox = new SimpleLightbox('.gallery a');

let options = {
  root: null,
  rootMargin: "300px",
  threshold: 0,
};

let observer = new IntersectionObserver(handlerPagination, options);

upButton.addEventListener("click", scrolTop)

let searchValue;

let page = 1;

async function onFormSubmit(e){
try {
    e.preventDefault();
    Loading.arrows();
    searchValue = form.elements.searchQuery.value.trim();
    const isValidInput = /^[a-zA-Z0-9\s]+$/.test(searchValue);
    if (!isValidInput || searchValue === "") {
      return Report.warning("Invalid input",  "Please enter a valid search query.");
    } else {
      observer.observe(guardJs)
      const {hits, totalHits} = await fetchImages(searchValue)
      Notify.success(`Hooray! We found ${totalHits} images`)
      imagesContainer.innerHTML = createMarkup(hits)
      simpleLightbox.refresh();
      e.target.reset()
    }}
     catch(error) {
      Report.warning("Invalid input",  "Please enter a valid search query.");
      console.log(error);
      }
     finally {
      Loading.remove();
}
}

function scrolTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
  upButton.style.visibility = "hidden";
}





 async function handlerPagination(entries, observer) {
  for (entry of entries) {
   if(entry.isIntersecting){
  try {
    page +=1;
    const {hits, totalHits} = await fetchImages(searchValue, page)
    imagesContainer.insertAdjacentHTML('beforeend', createMarkup(hits))
    Loading.arrows()
    simpleLightbox.refresh();
    if(hits.length === 0){
      Report.failure("Ups", "We're sorry, but you've reached the end of search results.")
      upButton.style.visibility = "visible";
    }
    } catch(err) {
      console.log(err);
      upButton.style.visibility = "visible";
      Report.failure("Ups", "We're sorry, but you've reached the end of search results.")
      }
      finally {
      Loading.remove();
    }
  }
 };
}

