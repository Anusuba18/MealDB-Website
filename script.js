const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function searchMeal() {
    const type = document.getElementById("searchType").value;
    const value = document.getElementById("searchInput").value.trim();

    if (!value) {
        alert("Please enter a value");
        return;
    }

    let url = "";

    switch (type) {
        case "name":
            url = `${BASE_URL}/search.php?s=${value}`;
            fetchMeals(url);
            break;

        case "letter":
            url = `${BASE_URL}/search.php?f=${value}`;
            fetchMeals(url);
            break;

        case "category":
            url = `${BASE_URL}/filter.php?c=${value}`;
            fetchAndLookup(url);
            break;

        case "area":
            url = `${BASE_URL}/filter.php?a=${value}`;
            fetchAndLookup(url);
            break;
    }
}

function fetchMeals(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

function fetchAndLookup(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.meals) {
                displayMeals(null);
                return;
            }

            Promise.all(
                data.meals.map(m =>
                    fetch(`${BASE_URL}/lookup.php?i=${m.idMeal}`)
                        .then(r => r.json())
                )
            ).then(results => {
                const meals = results.map(r => r.meals[0]);
                displayMeals(meals);
            });
        });
}
function updatePlaceholder() {
    const type = document.getElementById("searchType").value;
    const input = document.getElementById("searchInput");

    switch (type) {
        case "name":
            input.placeholder = "Enter meal name";
            break;
        case "letter":
            input.placeholder = "Enter first letter (e.g. a)";
            break;
        case "category":
            input.placeholder = "Enter category (e.g. Seafood)";
            break;
        case "area":
            input.placeholder = "Enter area (e.g. Italian)";
            break;
    }
}

function displayMeals(meals) {
    const result = document.getElementById("result");
    result.innerHTML = "";

    if (!meals) {
        result.innerHTML = "<h4 class='text-center'>No meals found</h4>";
        return;
    }

    meals.forEach(meal => {
        let ingredients = "";

        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
            }
        }

        result.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="card shadow h-100">
                    <img src="${meal.strMealThumb}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${meal.strMeal}</h6>
                        <p><b>Category:</b> ${meal.strCategory}</p>
                        <p><b>Area:</b> ${meal.strArea}</p>
                        <ul class="ingredients">${ingredients}</ul>
                    </div>
                </div>
            </div>
        `;
    });
}
