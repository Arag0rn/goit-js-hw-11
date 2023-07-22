import axios from "axios";
const BASE_URL = "https://pixabay.com/api/";


async function fetchImages(searchValue, page){
    const params = new URLSearchParams({
    key: "38368855-bf8c959061acd8b60d5e29ebb",
    q : searchValue,
    image_type : "photo",
    orientation: "horizontal",
    safesearch : true,
    page: `${page}`
    });

      const response = await axios.get(`${BASE_URL}?${params}`);
       if (response.data.hits.length === 0) {
        throw new Error("No images found");
    }
    return response.data.hits;

}

export { fetchImages}