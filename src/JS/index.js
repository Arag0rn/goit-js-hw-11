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
const guardJs = document.querySelector(".js-guard")
console.log("gallery:last-child");
form.addEventListener("submit", onFormSubmit);
const simpleLightbox = new SimpleLightbox('.gallery a');


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
      Report.warning("Invalid input",  "Please enter a valid search query.");
      Loading.remove();
      return;
    } else {
      const {hits, totalHits} = await fetchImages(searchValue)
      if(totalHits === 0){
        throw new Error("Nothing has defined")
      }
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
observer.observe(guardJs);
}

function scrolTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
  upButton.style.visibility = "hidden";
}


  let options = {
    root: null,
    rootMargin: "300px",
    threshold: 0,
  };

let observer = new IntersectionObserver(handlerPagination, options);


 async function handlerPagination(entries, observer) {
  for (let entry of entries) {
   if(entry.isIntersecting){
  try {
    Loading.arrows()
    page +=1;
    const {hits, totalHits} = await fetchImages(searchValue, page)
    imagesContainer.insertAdjacentHTML('beforeend', createMarkup(hits))
    if(hits.length < 40){
      observer.unobserve(entry.target)
    }
    simpleLightbox.refresh();
    console.log(hits);
    if(hits.length === 0 && entry.isIntersecting){
      upButton.style.visibility = "visible";
      Report.failure("Ups", "We're sorry, but you've reached the end of search results.")
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

let lastScrollTop = 0;

function handleScrollEnd() {
  upButton.style.visibility = "visible";
      Report.failure("Ups", "We're sorry, but you've reached the end of search results.")
  console.log('Достигнут конец скроллбара');
}

function onScroll() {
  const lastElement = document.getElementById('js-scrol-end');
  const lastElementPosition = lastElement.getBoundingClientRect().top;

  const currentScrollTop = window.scrollY;

  if (currentScrollTop > lastScrollTop && lastElementPosition <= window.innerHeight) {
    handleScrollEnd();
  }
  lastScrollTop = currentScrollTop;
}

window.addEventListener('scroll', onScroll);