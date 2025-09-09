const loadCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => categoriesItem(data.categories))
    .catch((err) => console.log(err));
};

const categoriesItem = (categories) => {
  const categoriesContainer = document.getElementById("category-list");
  categoriesContainer.innerHTML = `
    <li id="all-plants" class="bg-green-600 text-white p-2 rounded-md cursor-pointer hover:bg-purple-600 block w-full">
            All Plants
        </li>
    `;
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `
            <li id="${category.category_name}" class="hover:bg-cyan-600 hover:text-white rounded-md p-2 cursor-pointer block w-full">
                ${category.category_name}
            </li>
        `;
  });
  categoriesContainer.addEventListener("click", (event) => {
    const allLi = document.querySelectorAll("#category-list li");
    allLi.forEach((li) => li.classList.remove("bg-green-600", "text-white"));
    if (event.target.localName === "li") {
      event.target.classList.add("bg-green-600", "text-white");
      loadPlantCategory(event.target.id);
    }
    if (event.target.id === "all-plants") {
      loadPlantCategory();
    } else {
      loadPlantCategory(event.target.id);
    }
  });
};

// Plants-Loading

const loadPlantCategory = (categoryName = null) => {
  handleSpinner(true);
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let categoryPlants;
      if (categoryName) {
        categoryPlants = data.plants.filter(
          (plant) => plant.category === categoryName
        );
      } else {
        categoryPlants = data.plants;
      }
      displayPlants(categoryPlants);
    })
    .catch((err) => console.log(err));
};

const showPlantDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  displayPlantDetails(data.plants);
};

//handle-spinner

const handleSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("plants-container").classList.add("hidden");
  } else {
    document.getElementById("plants-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const displayPlantDetails = (plant) => {
  const plantsDetails = document.getElementById("plant-details-container");
  plantsDetails.innerHTML = `
        <div class="p-2 space-y-3">
            <h1 class="font-bold text-2xl">${plant.name}</h1>
           <img class="rounded-md h-80 w-full my-2 cursor-pointer" onclick="showPlantDetails('${plant.id}')" src="${plant.image}" alt="${plant.name}" />
            <p><span class="font-bold">Category:</span> ${plant.category}</p>
            <p class="my-2"><span class="font-bold">Price:</span> <i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</p>
            <p><span class="font-bold">Description:</span> ${plant.description}</p>
            <button id="modal-add-to-cart" class="btn bg-green-600 hover:bg-red-400 text-white w-full rounded-3xl">Add to Cart</button>
        </div>
    `;
  document.getElementById("modal-green-earth").showModal();

  // Add to Cart- button in the modal
  document.getElementById("modal-add-to-cart").addEventListener("click", () => {
    alert(`${plant.name} has been added to the cart`);
    cartItems.push({
      title: plant.name,
      price: plant.price,
    });
    showCartItem(cartItems);
  });
};

// Display-Plants-Container

const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plants-container");
  plantsContainer.innerHTML = "";
  plants.forEach((plant) => {
    plantsContainer.innerHTML += `
            <div class="card bg-base-100 w-full gap-3 shadow-sm">
                <figure class="p-2">
                    <img class="rounded-t-lg h-80 w-full cursor-pointer" src="${plant.image}" alt="${plant.name}" onclick="showPlantDetails('${plant.id}')"/>
                </figure>
                <div class="card-body">
                    <h2 onclick="showPlantDetails('${plant.id}')" class="card-title cursor-pointer">${plant.name}</h2>
                    <p>${plant.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="bg-green-100 p-2 rounded-2xl text-green-600">${plant.category}</span>
                        <span><i class="fa-solid fa-bangladeshi-taka-sign"></i>${plant.price}</span>
                    </div>
                    <button id="add-to-cart" class="btn bg-green-600 hover:bg-red-400 text-white w-full rounded-3xl">Add to Cart</button>
                </div>
            </div>
        `;
  });
  handleSpinner(false);
};

loadCategory();
loadPlantCategory();

//  add to cart -container

let cartItems = [];
const cartContainer = document.getElementById("cart-Container");
const addToCart = document.getElementById("plants-container");
addToCart.addEventListener("click", (event) => {
  if (event.target.id === "add-to-cart") {
    const alertTitle = event.target.parentNode.children[0].innerText;
    alert(`${alertTitle} has been added to the cart`);
    handleCartItem(event);
  }
});

const handleCartItem = (event) => {
  const title = event.target.parentNode.children[0].innerText;
  const priceText = event.target.parentNode.children[2].children[1].innerText;
  const price = parseFloat(priceText.slice(0));
  cartItems.push({
    title: title,
    price: price,
  });
  showCartItem(cartItems);
};

const showCartItem = (cartItems) => {
  cartContainer.innerHTML = "";
  let total = 0;
  cartItems.forEach((cartItem) => {
    total += cartItem.price;
    cartContainer.innerHTML += `
           <div class="p-2 my-2 bg-green-100 rounded-sm">
                <div class="flex justify-between mx-auto font-bold">
                    <h2>${cartItem.title}</h2>
                    <p onclick="handleRemoveCart('${cartItem.title}')" class="cursor-pointer">❌</p>
                </div>
                <p><i class="fa-solid fa-bangladeshi-taka-sign"></i>${cartItem.price}</p>
            </div> 
        `;
  });
  if (cartItems.length > 0) {
    cartContainer.innerHTML += `
        <div class="p-2 my-2 bg-green-100 rounded-sm text-right font-bold">
            <p>Total : <i class="fa-solid fa-bangladeshi-taka-sign"></i>${total}</p>
        </div>
        `;
  }
};

// cart-container-handler

const handleRemoveCart = (cartItemTitle) => {
  cartItems = cartItems.filter((item) => item.title !== cartItemTitle);
  showCartItem(cartItems);
};
