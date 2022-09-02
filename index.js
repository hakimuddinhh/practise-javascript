import { configureFormValidations } from "./form-validator.js";
import { store } from "./store.js";
/////////////////////////

const getDOMElements = () => {
  const elements = {};
  elements.submitButtonElement = document.querySelector("#submit-form");
  elements.formElement = document.querySelector("#form");
  elements.photosContainer = document.querySelector(".photos-container");
  return elements;
};

const submitHandler = (e) => {
  store.setState("isAuthenticated", true);
};

const configureForm = (formElement) => {
  configureFormValidations(
    formElement,
    {
      name: {
        required: true,
        min: 4,
      },
      email: {
        required: true,
        isEmail: true,
      },
      password: {
        required: true,
        validate: (value) => value.length > 5 && value.length < 10,
      },
    },
    submitHandler
  );
};

const fetchPhotos = async () => {
  const {pageIndex} = store.getState();
  const URL = `https://api.pexels.com/v1/curated?page=${pageIndex}&per_page=10`;
  const API_KEY = "563492ad6f91700001000001c15a2bc30a2c4bc19c98850ca32d1d2f";
  const headers = new Headers({
    authorization: API_KEY,
  });
  const result = await fetch(URL, { headers });
  const photosData = await result.json();
  store.setState("photoList", photosData.photos);
  store.setState("pageIndex", pageIndex+1);
};

const renderPhotos = (list) => {
  const elements = [];
  const { photosContainer } = getDOMElements();

  for (let item of list) {
    const imageContainerElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = item.src.medium;
    const imageCaptionElement = document.createElement("figcaption");
    imageCaptionElement.innerText = item.photographer;
    imageContainerElement.id = item.id;
    imageContainerElement.append(imageElement, imageCaptionElement);
    elements.push(imageContainerElement);
  }

  photosContainer.append(...elements);
};

const onPhotosListChange = (list) => {
  renderPhotos(list);
};

const removeForm = () => {
  const { formElement } = getDOMElements();
  formElement.remove();
}

const navigate = () => {
  removeForm();
  fetchPhotos();
};

const onLoad = () => {
  store.subscribe("photoList", onPhotosListChange);
  store.subscribe("isAuthenticated", navigate);
  const { formElement } = getDOMElements();
  configureForm(formElement);
};

document.addEventListener("DOMContentLoaded", onLoad);
