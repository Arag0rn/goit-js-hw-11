import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";
import { Loading } from 'notiflix/build/notiflix-loading-aio'
import { Report } from 'notiflix/build/notiflix-report-aio';
import { createMarkup } from "./modules/galery.markup";
import { fetchImages } from "./modules/fetch";
const form = document.querySelector("#search-form");
const imagesContainer = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");
const upButton = document.querySelector(".upButton");

form.addEventListener("submit", onSearch);
const simpleLightbox = new SimpleLightbox('.gallery a');

loadMoreButton.addEventListener("click", onLoadmore)
upButton.addEventListener("click", scrolTop)


async function onSearch(e){
try {
    e.preventDefault();
    Loading.arrows();
    searchValue = form.elements.searchQuery.value.trim();
    const isValidInput = /^[a-zA-Z0-9\s]+$/.test(searchValue);
    if (!isValidInput){
      Report.warning("Invalid input",  "Please enter a valid search query.");
      return
    }
      const searchImg = await fetchImages(searchValue)
      imagesContainer.innerHTML = createMarkup(searchImg)
      simpleLightbox.refresh();
      loadMoreButton.style.visibility = "visible";
      e.target.reset()
    }
     catch(error) {
      Report.failure()
      console.log(error);
      }
     finally {
      Loading.remove();
}
}

let page = 1;

async function onLoadmore() {
try
{
Loading.arrows()
page += 1;
const moreImages = await fetchImages(searchValue, page)
imagesContainer.insertAdjacentHTML('beforeend', createMarkup(moreImages))
simpleLightbox.refresh();
loadMoreButton.style.visibility = "visible";
} catch(err) {
  Report.failure("Ups", "We're sorry, but you've reached the end of search results.")
    loadMoreButton.style.visibility = "hidden";
    upButton.style.visibility = "visible";
  }
  finally {
    Loading.remove();
}}

function scrolTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

